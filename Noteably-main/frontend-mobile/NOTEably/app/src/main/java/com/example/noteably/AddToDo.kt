package com.example.noteably

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.MenuItem
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
import com.example.noteably.model.ToDoRequest
import com.example.noteably.api_client.APIClient
import com.example.noteably.api_client.ToDoAPIClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AddToDo : AppCompatActivity() {

    private lateinit var binding: ActivityAddToDoBinding
    private var student: Student? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityAddToDoBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Get student data from intent
        student = intent.getParcelableExtra("student")
        if (student != null) {
            binding.studentName.text = student?.name
            binding.studentId.text = student?.studentId
        } else {
            binding.studentName.text = "N/A"
            binding.studentId.text = "N/A"
        }

        Glide.with(this)
            .load(R.drawable.blueprofile)
            .override(140, 140)
            .into(binding.imageView)

        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Handle create task button
        binding.addTaskBttn.setOnClickListener {
            createTask()
        }

        // Back button
        binding.backTask.setOnClickListener {
            finish()
        }

        // Navigation buttons
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
            // Stay in current activity
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

        binding.moreSetting.setOnClickListener { view ->
            showPopupMenu(view)
        }
    }

    private fun createTask() {
        val title = binding.inputTitle.text.toString().trim()
        val schedule = binding.inputSchedule.text.toString().trim()
        val description = binding.inputDescription.text.toString().trim()

        if (title.isEmpty() || description.isEmpty()) {
            Toast.makeText(this, "Please fill in the title and description", Toast.LENGTH_SHORT).show()
            return
        }

        val studentId = student?.studentId ?: run {
            Toast.makeText(this, "Missing student ID", Toast.LENGTH_SHORT).show()
            return
        }

        val dummySchedule = if (schedule.isEmpty()) "2025-01-01" else schedule

        val request = ToDoRequest(
            studentId = studentId,
            title = title,
            schedule = dummySchedule,
            description = description
        )

        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Use ToDoAPIClient that includes AuthInterceptor with token
                val response = ToDoAPIClient.getApiService(this@AddToDo).addTask(request)

                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@AddToDo, "Task added successfully!", Toast.LENGTH_SHORT).show()
                        finish()
                    } else {
                        Toast.makeText(this@AddToDo, "Failed to add task: ${response.code()}", Toast.LENGTH_SHORT).show()
                        Log.e("AddToDo", "Error response: ${response.errorBody()?.string()}")
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@AddToDo, "Error: ${e.message}", Toast.LENGTH_LONG).show()
                }
                Log.e("AddToDo", "Exception during task creation", e)
            }
        }
    }

    private fun goToActivity(cls: Class<*>) {
        val intent = Intent(this, cls)
        intent.putExtra("student", student)
        startActivity(intent)
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

    private fun fetchStudentData(studentId: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                Log.d("Dashboard", "Calling API with studentId: $studentId")
                val response = APIClient.apiService.getStudent(studentId)

                if (response.isSuccessful && response.body() != null) {
                    val student = response.body()
                    withContext(Dispatchers.Main) {
                        Log.d("Dashboard", "Student fetched: name=${student?.name}, id=${student?.studentId}")
                        binding.studentName.text = student?.name ?: "No Name"
                        binding.studentId.text = student?.studentId ?: "N/A"
                    }
                } else {
                    Log.e("Dashboard", "Failed to load student. Code: ${response.code()}")
                    withContext(Dispatchers.Main) {
                        binding.studentName.text = "Error loading name"
                        binding.studentId.text = "Error loading ID"
                    }
                }
            } catch (e: Exception) {
                Log.e("Dashboard", "Error fetching student data: ${e.message}")
                withContext(Dispatchers.Main) {
                    binding.studentName.text = "Network error"
                    binding.studentId.text = "Try again later"
                }
            }
        }
    }

    override fun onBackPressed() {
        super.onBackPressed()
        finishAffinity()
    }
}