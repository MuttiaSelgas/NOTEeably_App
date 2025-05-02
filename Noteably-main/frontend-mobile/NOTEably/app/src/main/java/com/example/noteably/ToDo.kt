package com.example.noteably

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.MenuItem
import android.view.View
import android.widget.Button
import android.widget.PopupMenu
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.example.noteably.databinding.ActivityToDoBinding
import com.example.noteably.model.Student
import com.example.noteably.model.ToDo
import com.example.noteably.network.ToDoAPIClient
import com.example.noteably.util.TaskAdapter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ToDo : AppCompatActivity() {

    private lateinit var binding: ActivityToDoBinding
    private lateinit var toDoAdapter: TaskAdapter
    private var student: Student? = null  // ✅ Moved to class level

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        binding = ActivityToDoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        Glide.with(this)
            .load(R.drawable.blueprofile)
            .override(140, 140)
            .into(binding.imageView)

        student = intent.getParcelableExtra("student")  // ✅ Assigned to class-level variable
        if (student != null) {
            Log.d("ToDo", "Loaded student: ${student!!.name} (${student!!.studentId})")
            binding.studentName.text = student!!.name
            binding.studentId.text = student!!.studentId

            ToDoAPIClient.initClient(this)

            val token = getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
                .getString("jwt_token", null)
            Log.d("ToDo", "Token before fetching ToDo list: $token")

            fetchToDoList(student!!.studentId)
        } else {
            Log.e("ToDo", "No student found in intent")
            binding.studentName.text = "N/A"
            binding.studentId.text = "N/A"
        }

        binding.moreSetting.setOnClickListener { showPopupMenu(it) }

        binding.dashboardbttn.setOnClickListener {
            goToActivity(Dashboard::class.java)
        }

        binding.folderbttn.setOnClickListener {
            goToActivity(Folder::class.java)
        }

        binding.todobttn.setOnClickListener {
            // Stay on current screen
        }

        binding.calendarbttn.setOnClickListener {
            goToActivity(Calendar::class.java)
        }

        binding.timerbttn.setOnClickListener {
            goToActivity(Timer::class.java)
        }

        binding.settingsbttn.setOnClickListener {
            goToActivity(Settings::class.java)
        }

        findViewById<Button>(R.id.addTaskBttn).setOnClickListener {
            val addTaskIntent = Intent(this, AddToDo::class.java)
            addTaskIntent.putExtra("student", student)  // ✅ This now works
            startActivity(addTaskIntent)
        }

        toDoAdapter = TaskAdapter(mutableListOf()) { /* handle delete */ }
        binding.taskRecycler.layoutManager = LinearLayoutManager(this)
        binding.taskRecycler.adapter = toDoAdapter
    }

    private fun goToActivity(cls: Class<*>) {
        val intent = Intent(this, cls)
        intent.putExtra("student", student)
        startActivity(intent)
    }

    private fun showPopupMenu(view: View) {
        val popup = PopupMenu(this, view)
        popup.menuInflater.inflate(R.menu.menu_dashboard, popup.menu)
        popup.setOnMenuItemClickListener { item: MenuItem ->
            if (item.itemId == R.id.action_logout) {
                logout()
                true
            } else false
        }
        popup.show()
    }

    private fun logout() {
        val intent = Intent(this, MainActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
    }

    private fun fetchToDoList(studentId: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                Log.d("ToDo", "Fetching ToDo list for studentId: $studentId")
                val numericStudentId = studentId.filter { it.isDigit() }
                val apiService = ToDoAPIClient.instance

                val response = apiService.getToDoListByStudentId(numericStudentId.toInt())

                if (response.isSuccessful && response.body() != null) {
                    val todoList = response.body()!!
                    withContext(Dispatchers.Main) {
                        Log.d("ToDo", "Fetched ${todoList.size} tasks")
                        toDoAdapter.updateData(todoList)
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        Log.e("ToDo", "Failed to load ToDo list. Code: ${response.code()}")
                        Toast.makeText(this@ToDo, "Failed to load tasks", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                Log.e("ToDo", "Error fetching ToDo list: ${e.message}")
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@ToDo, "Error loading tasks", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    override fun onBackPressed() {
        super.onBackPressed()
        finishAffinity()
    }
}