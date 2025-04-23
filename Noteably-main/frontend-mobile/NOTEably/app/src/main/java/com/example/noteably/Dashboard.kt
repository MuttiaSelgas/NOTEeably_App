package com.example.noteably

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.MenuItem
import android.view.View
import android.widget.PopupMenu
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.bumptech.glide.Glide
import com.example.noteably.databinding.ActivityDashboardBinding
import com.example.noteably.model.Student

class Dashboard : AppCompatActivity() {

    private lateinit var binding: ActivityDashboardBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Load profile placeholder
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

        // Navigation
        val studentId = student?.studentId ?: ""
        val putExtra = { intent: Intent ->
            intent.putExtra("student", student)
            startActivity(intent)
        }

        binding.dashboardbttn.setOnClickListener { } // Already here
        binding.folderbttn.setOnClickListener { putExtra(Intent(this, Folder::class.java)) }
        binding.todobttn.setOnClickListener { putExtra(Intent(this, ToDo::class.java)) }
        binding.calendarbttn.setOnClickListener { putExtra(Intent(this, Calendar::class.java)) }
        binding.timerbttn.setOnClickListener { putExtra(Intent(this, Timer::class.java)) }
        binding.settingsbttn.setOnClickListener { putExtra(Intent(this, Settings::class.java)) }

        binding.todoIcon.setOnClickListener { putExtra(Intent(this, ToDo::class.java)) }
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

    override fun onBackPressed() {
        super.onBackPressed()
        finishAffinity()
    }
}