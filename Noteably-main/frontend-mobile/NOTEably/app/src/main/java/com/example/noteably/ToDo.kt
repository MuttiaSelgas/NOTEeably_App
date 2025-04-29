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

        val student = intent.getParcelableExtra<Student>("student")
        if (student != null) {
            Log.d("ToDo", "Loaded student: ${student.name} (${student.studentId})")
            binding.studentName.text = student.name
            binding.studentId.text = student.studentId

            // ✅ Initialize ToDoAPIClient with JWT before making any API call
            ToDoAPIClient.initClient(this)

            val token = getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
                .getString("jwt_token", null)
            Log.d("ToDo", "Token before fetching ToDo list: $token")

            fetchToDoList(student.studentId)
        } else {
            Log.e("ToDo", "No student found in intent")
            binding.studentName.text = "N/A"
            binding.studentId.text = "N/A"
        }

        binding.moreSetting.setOnClickListener { view ->
            showPopupMenu(view)
        }

        binding.dashboardbttn.setOnClickListener {
            val dashboardIntent = Intent(this, Dashboard::class.java)
            dashboardIntent.putExtra("student", student)
            startActivity(dashboardIntent)
        }

        binding.folderbttn.setOnClickListener {
            val folderIntent = Intent(this, Folder::class.java)
            folderIntent.putExtra("student", student)
            startActivity(folderIntent)
        }

        binding.todobttn.setOnClickListener {
            // Current screen, do nothing or refresh
        }

        binding.calendarbttn.setOnClickListener {
            val calendarIntent = Intent(this, Calendar::class.java)
            calendarIntent.putExtra("student", student)
            startActivity(calendarIntent)
        }

        binding.timerbttn.setOnClickListener {
            val timerIntent = Intent(this, Timer::class.java)
            timerIntent.putExtra("student", student)
            startActivity(timerIntent)
        }

        binding.settingsbttn.setOnClickListener {
            val settingsIntent = Intent(this, Settings::class.java)
            settingsIntent.putExtra("student", student)
            startActivity(settingsIntent)
        }

        val addTaskButton = findViewById<Button>(R.id.addTaskBttn)
        addTaskButton.setOnClickListener {
            val addTaskIntent = Intent(this, AddToDo::class.java)
            addTaskIntent.putExtra("student", student)
            startActivity(addTaskIntent)
        }

        // Initialize the adapter with an empty list
        toDoAdapter = TaskAdapter(mutableListOf()) { /* handle delete if needed */ }

        // Setup RecyclerView
        binding.taskRecycler.layoutManager = LinearLayoutManager(this)
        binding.taskRecycler.adapter = toDoAdapter
    }

    private fun showPopupMenu(view: View) {
        val popup = PopupMenu(this, view)
        popup.menuInflater.inflate(R.menu.menu_dashboard, popup.menu)
        popup.setOnMenuItemClickListener { menuItem: MenuItem ->
            when (menuItem.itemId) {
                R.id.action_logout -> {
                    logout()
                    true
                }
                else -> false
            }
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