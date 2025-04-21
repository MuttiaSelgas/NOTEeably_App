package com.example.noteably

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.MenuItem
import android.view.View
import android.widget.PopupMenu
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.bumptech.glide.Glide
import com.example.noteably.databinding.ActivityTimerBinding
import com.example.noteably.model.Student
import com.example.noteably.network.APIClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class Timer : AppCompatActivity() {

    private lateinit var binding: ActivityTimerBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        binding = ActivityTimerBinding.inflate(layoutInflater)
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
            Log.d("Dashboard", "Loaded student: ${student?.name} (${student?.studentId})")
            binding.studentName.text = student.name
            binding.studentId.text = student.studentId
        } else {
            Log.e("Dashboard", "No student found in intent")
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
            val todoIntent = Intent(this, ToDo::class.java)
            todoIntent.putExtra("student", student)
            startActivity(todoIntent)
        }

        binding.calendarbttn.setOnClickListener {
            val calendarIntent = Intent(this, Calendar::class.java)
            calendarIntent.putExtra("student", student)
            startActivity(calendarIntent)
        }

        binding.timerbttn.setOnClickListener {

        }

        binding.settingsbttn.setOnClickListener {
            val settingsIntent = Intent(this, Settings::class.java)
            settingsIntent.putExtra("student", student)
            startActivity(settingsIntent)
        }
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
