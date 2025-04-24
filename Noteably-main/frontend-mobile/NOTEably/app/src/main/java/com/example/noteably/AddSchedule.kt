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
import com.example.noteably.databinding.ActivityAddScheduleBinding
import com.example.noteably.model.Student

class AddSchedule : AppCompatActivity() {

    private lateinit var binding: ActivityAddScheduleBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        binding = ActivityAddScheduleBinding.inflate(layoutInflater)
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
            Log.d("Dashboard", "Loaded student: ${student.name} (${student.studentId})")
            binding.studentName.text = student.name
            binding.studentId.text = student.studentId
        } else {
            Log.e("Dashboard", "No student found in intent")
            binding.studentName.text = "N/A"
            binding.studentId.text = "N/A"
        }

        // Menu click
        binding.moreSetting.setOnClickListener { view ->
            showPopupMenu(view)
        }

        binding.backSchedule.setOnClickListener {
            finish()
        }

        // Navigation buttons
        binding.dashboardbttn.setOnClickListener {
            startActivity(Intent(this, Dashboard::class.java).putExtra("student", student))
        }

        binding.folderbttn.setOnClickListener {
            startActivity(Intent(this, Folder::class.java).putExtra("student", student))
        }

        binding.todobttn.setOnClickListener {
            startActivity(Intent(this, ToDo::class.java).putExtra("student", student))
        }

        binding.calendarbttn.setOnClickListener {
            // TODO: Add functionality when ready
        }

        binding.timerbttn.setOnClickListener {
            startActivity(Intent(this, Timer::class.java).putExtra("student", student))
        }

        binding.settingsbttn.setOnClickListener {
            startActivity(Intent(this, Settings::class.java).putExtra("student", student))
        }

        // Optional: you can remove this if you're already in AddSchedule
        /*binding.addScheduleBttn.setOnClickListener {
            // Optionally refresh or show a message instead of reloading same activity
            recreate() // or showToast("You're already here")
        }*/
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