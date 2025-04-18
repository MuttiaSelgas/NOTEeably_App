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
import com.example.noteably.databinding.ActivityDashboardBinding
import com.example.noteably.network.APIClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class Dashboard : AppCompatActivity() {

    private lateinit var binding: ActivityDashboardBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // 🔧 First: Inflate the layout properly using ViewBinding
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // 🧱 Apply padding for notches/system bars
        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // 🖼️ Load default profile image
        Glide.with(this)
            .load(R.drawable.blueprofile)
            .override(140, 140)
            .into(binding.imageView)

        // 🎯 Get studentId from intent
        val studentId = intent.getStringExtra("STUDENT_ID") ?: ""
        Log.d("Dashboard", "Received student ID: $studentId")
        if (studentId.isNotEmpty()) {
            fetchStudentData(studentId)
        } else {
            Log.e("Dashboard", "No student ID found in intent.")
        }

        // ⚙️ More button menu
        binding.moreSetting.setOnClickListener { view ->
            showPopupMenu(view)
        }

        // 🔘 Navigation Buttons
        binding.dashboardbttn.setOnClickListener {
            // Already on Dashboard - no action needed or reload
        }

        binding.folderbttn.setOnClickListener {
            val folderIntent = Intent(this, Folder::class.java)
            folderIntent.putExtra("STUDENT_ID", intent.getStringExtra("STUDENT_ID"))
            startActivity(folderIntent)
        }

        binding.todobttn.setOnClickListener {
            val todoIntent = Intent(this, ToDo::class.java)
            todoIntent.putExtra("STUDENT_ID", intent.getStringExtra("STUDENT_ID"))
            startActivity(todoIntent)
        }

        binding.calendarbttn.setOnClickListener {
            val calendarIntent = Intent(this, Calendar::class.java)
            calendarIntent.putExtra("STUDENT_ID", intent.getStringExtra("STUDENT_ID"))
            startActivity(calendarIntent)
        }

        binding.timerbttn.setOnClickListener {
            val timerIntent = Intent(this, Timer::class.java)
            timerIntent.putExtra("STUDENT_ID", intent.getStringExtra("STUDENT_ID"))
            startActivity(timerIntent)
        }

        binding.settingsbttn.setOnClickListener {
            val settingsIntent = Intent(this, Settings::class.java)
            settingsIntent.putExtra("STUDENT_ID", intent.getStringExtra("STUDENT_ID"))
            startActivity(settingsIntent)
        }
    }

    // 📋 Menu popup for logout
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

    // 🔐 Logout and go back to MainActivity
    private fun logout() {
        val intent = Intent(this, MainActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
    }

    // 🌐 Fetch student data from backend by custom studentId
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
