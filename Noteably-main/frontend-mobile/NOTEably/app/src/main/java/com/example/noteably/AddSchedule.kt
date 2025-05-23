package com.example.noteably

import android.app.DatePickerDialog
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.MenuItem
import android.view.View
import android.widget.PopupMenu
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.bumptech.glide.Glide
import com.example.noteably.databinding.ActivityAddScheduleBinding
import com.example.noteably.model.ScheduleModel
import com.example.noteably.model.Student
import com.example.noteably.network.APIClient
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.*

class AddSchedule : AppCompatActivity() {

    private lateinit var binding: ActivityAddScheduleBinding
    private val priorityOptions = arrayOf("High", "Medium", "Low")

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
            binding.studentName.text = student.name
            binding.studentId.text = student.studentId

            com.example.noteably.util.TokenProvider.saveToken(student.jwtToken ?: "")
        } else {
            binding.studentName.text = "N/A"
            binding.studentId.text = "N/A"
        }

        binding.moreSetting.setOnClickListener { view -> showPopupMenu(view) }

        binding.backSchedule.setOnClickListener { finish() }

        // 🔽 Priority dropdown (on button click instead of EditText)
        binding.priorityDropdown.setOnClickListener {
            showPriorityDialog()
        }

        // 📅 Start Date Picker button
        binding.startDatePicker.setOnClickListener {
            showDatePicker { selected ->
                binding.inputStartDate.setText(selected)
            }
        }

        // 📅 End Date Picker button
        binding.endDatePicker.setOnClickListener {
            showDatePicker { selected ->
                binding.inputEndDate.setText(selected)
            }
        }

        // Navigation buttons
        val navTargets = mapOf(
            binding.dashboardbttn to Dashboard::class.java,
            binding.folderbttn to Folder::class.java,
            binding.todobttn to ToDo::class.java,
            binding.timerbttn to Timer::class.java,
            binding.settingsbttn to Settings::class.java
        )
        navTargets.forEach { (button, targetClass) ->
            button.setOnClickListener {
                startActivity(Intent(this, targetClass).putExtra("student", student))
            }
        }

        // ✅ Create button logic
        binding.addTaskBttn.isClickable = true
        binding.addTaskBttn.setOnClickListener {
            val title = binding.inputScheduleTitle.text.toString()
            val priority = binding.inputPriority.text.toString()
            val startDate = binding.inputStartDate.text.toString()
            val endDate = binding.inputEndDate.text.toString()

            if (title.isBlank() || priority.isBlank() || startDate.isBlank()) {
                Toast.makeText(this, "Please fill in required fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val schedule = ScheduleModel(
                scheduleID = 0,
                studentId = student?.id ?: 0,
                title = title,
                priority = priority,
                colorCode = "#ef476f",
                startDate = startDate,
                endDate = if (endDate.isBlank()) null else endDate
            )

            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val response = APIClient.scheduleApi.createSchedule(schedule)
                    if (response.isSuccessful) {
                        withContext(Dispatchers.Main) {
                            Toast.makeText(this@AddSchedule, "Schedule created!", Toast.LENGTH_SHORT).show()
                            finish()
                        }
                    } else {
                        Log.e("AddSchedule", "API failed: ${response.code()}")
                    }
                } catch (e: Exception) {
                    Log.e("AddSchedule", "Error: ${e.message}")
                }
            }
        }
    }

    // 📅 Date Picker Dialog
    private fun showDatePicker(onDateSelected: (String) -> Unit) {
        val calendar = java.util.Calendar.getInstance()
        val datePicker = DatePickerDialog(
            this,
            { _, year, month, dayOfMonth ->
                val pickedDate = java.util.Calendar.getInstance()
                pickedDate.set(year, month, dayOfMonth)
                val format = SimpleDateFormat("yyyy-MM-dd", Locale.US)
                onDateSelected(format.format(pickedDate.time))
            },
            calendar.get(java.util.Calendar.YEAR),
            calendar.get(java.util.Calendar.MONTH),
            calendar.get(java.util.Calendar.DAY_OF_MONTH)
        )
        datePicker.show()
    }

    // 🔽 Priority Dialog
    private fun showPriorityDialog() {
        AlertDialog.Builder(this)
            .setTitle("Select Priority")
            .setItems(priorityOptions) { _, which ->
                binding.inputPriority.setText(priorityOptions[which])
            }
            .show()
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