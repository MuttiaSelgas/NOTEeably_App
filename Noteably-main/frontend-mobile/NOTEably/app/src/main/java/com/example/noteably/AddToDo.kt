package com.example.noteably

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.PopupMenu
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.bumptech.glide.Glide
import com.example.noteably.databinding.ActivityAddToDoBinding
import com.example.noteably.model.Student
import com.example.noteably.model.ToDo
import com.example.noteably.network.ToDoAPIClient
import com.example.noteably.network.ToDoAPIService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AddToDo : AppCompatActivity() {

    private lateinit var binding: ActivityAddToDoBinding
    private var student: Student? = null
    private lateinit var apiService: ToDoAPIService

    // For future use if you add a schedule dropdown
    private var selectedScheduleId: Int = 4 // Default/hardcoded for now

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityAddToDoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        apiService = ToDoAPIClient.instance
        student = intent.getParcelableExtra("student")

        binding.studentName.text = student?.name ?: "N/A"
        binding.studentId.text = student?.studentId ?: "N/A"

        Glide.with(this)
            .load(R.drawable.blueprofile)
            .override(140, 140)
            .into(binding.imageView)

        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { view, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            view.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        binding.inputSchedule.setOnClickListener {
            showSchedulePopup() // Optional: in future, pick schedule
        }

        binding.addTaskBttn.setOnClickListener { createTask() }
        binding.backTask.setOnClickListener { finish() }

        binding.dashboardbttn.setOnClickListener { goToActivity(Dashboard::class.java) }
        binding.folderbttn.setOnClickListener { goToActivity(Folder::class.java) }
        binding.todobttn.setOnClickListener { /* Stay */ }
        binding.calendarbttn.setOnClickListener { goToActivity(Calendar::class.java) }
        binding.timerbttn.setOnClickListener { goToActivity(Timer::class.java) }
        binding.settingsbttn.setOnClickListener { goToActivity(Settings::class.java) }

        binding.moreSetting.setOnClickListener { showPopupMenu(it) }

        student = intent.getParcelableExtra("student")
        Log.d("AddToDo", "Received student: $student")
    }

    private fun createTask() {
        val title = binding.inputTitle.text.toString().trim()
        val description = binding.inputDescription.text.toString().trim()
        val studentId = student?.id

        if (title.isEmpty() || description.isEmpty()) {
            Toast.makeText(this, "Please fill in the title and description", Toast.LENGTH_SHORT).show()
            return
        }

        if (studentId == null || studentId <= 0) {
            Toast.makeText(this, "Missing or invalid student ID", Toast.LENGTH_SHORT).show()
            return
        }

        val request = ToDo(
            title = title,
            description = description,
            studentId = studentId,
            sched = ToDo.Schedule(scheduleID = selectedScheduleId)
        )

        Log.d("AddToDo", "Sending ToDo -> $request")

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
                val token = sharedPreferences.getString("jwt_token", null)

                if (token == null) {
                    withContext(Dispatchers.Main) {
                        Toast.makeText(this@AddToDo, "No token found. Please log in again.", Toast.LENGTH_SHORT).show()
                    }
                    return@launch
                }

                val authHeader = "Bearer $token"
                val response = apiService.postToDoList(authHeader, request)

                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@AddToDo, "Task added successfully!", Toast.LENGTH_SHORT).show()
                        finish()
                    } else {
                        val errorBody = response.errorBody()?.string()
                        Log.e("AddToDo", "HTTP ${response.code()} Error: $errorBody")
                        Toast.makeText(this@AddToDo, "Failed to add task: ${response.code()}", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                Log.e("AddToDo", "Exception during task creation", e)
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@AddToDo, "Error: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    private fun showSchedulePopup() {
        val popup = PopupMenu(this, binding.inputSchedule)

        // TODO: Replace with dynamic backend call
        val schedules = mapOf("Math Homework" to 1, "Science Lab" to 2, "Finals" to 3)

        schedules.forEach { (label, id) ->
            popup.menu.add(label).setOnMenuItemClickListener {
                binding.inputSchedule.setText(label)
                selectedScheduleId = id
                true
            }
        }

        popup.show()
    }

    private fun goToActivity(cls: Class<*>) {
        val intent = Intent(this, cls)
        intent.putExtra("student", student)
        startActivity(intent)
    }

    private fun showPopupMenu(view: View) {
        val popup = PopupMenu(this, view)
        popup.menuInflater.inflate(R.menu.menu_dashboard, popup.menu)
        popup.setOnMenuItemClickListener { menuItem ->
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

    override fun onBackPressed() {
        super.onBackPressed()
        finishAffinity()
    }
}