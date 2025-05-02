package com.example.noteably

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.MenuItem
import android.view.View
import android.widget.PopupMenu
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.example.noteably.databinding.ActivityCalendarBinding
import com.example.noteably.model.ScheduleModel
import com.example.noteably.model.Student
import com.example.noteably.network.APIClient
import com.example.noteably.util.ScheduleAdapter
import com.prolificinteractive.materialcalendarview.CalendarDay
import com.prolificinteractive.materialcalendarview.DayViewDecorator
import com.prolificinteractive.materialcalendarview.DayViewFacade
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class Calendar : AppCompatActivity() {

    private lateinit var binding: ActivityCalendarBinding
    lateinit var adapter: ScheduleAdapter
    private var student: Student? = null

    private val scheduleActivityLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) {
        reloadScheduleList()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        binding = ActivityCalendarBinding.inflate(layoutInflater)
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

        student = intent.getParcelableExtra("student")
        if (student != null) {
            binding.studentName.text = student!!.name
            binding.studentId.text = student!!.studentId
            com.example.noteably.util.TokenProvider.saveToken(student!!.jwtToken ?: "")
        } else {
            binding.studentName.text = "N/A"
            binding.studentId.text = "N/A"
        }

        binding.moreSetting.setOnClickListener { view -> showPopupMenu(view) }

        val putExtra = { intent: Intent ->
            intent.putExtra("student", student)
            startActivity(intent)
        }

        binding.dashboardbttn.setOnClickListener { putExtra(Intent(this, Dashboard::class.java)) }
        binding.folderbttn.setOnClickListener { putExtra(Intent(this, Folder::class.java)) }
        binding.todobttn.setOnClickListener { putExtra(Intent(this, ToDo::class.java)) }
        binding.calendarbttn.setOnClickListener { }
        binding.timerbttn.setOnClickListener { putExtra(Intent(this, Timer::class.java)) }
        binding.settingsbttn.setOnClickListener { putExtra(Intent(this, Settings::class.java)) }

        binding.addScheduleBttn.setOnClickListener {
            val addScheduleIntent = Intent(this, AddSchedule::class.java)
            addScheduleIntent.putExtra("student", student)
            scheduleActivityLauncher.launch(addScheduleIntent)
        }

        adapter = ScheduleAdapter { view, schedule ->
            val popup = PopupMenu(this, view)
            popup.menuInflater.inflate(R.menu.menu_edit_delete, popup.menu)
            popup.setOnMenuItemClickListener { item ->
                when (item.itemId) {
                    R.id.action_edit -> {
                        val intentUpdateSchedule = Intent(this, UpdateSchedule::class.java)
                        intentUpdateSchedule.putExtra("student", student)
                        intentUpdateSchedule.putExtra("schedule", schedule)
                        scheduleActivityLauncher.launch(intentUpdateSchedule)
                        true
                    }
                    R.id.action_delete -> {
                        CoroutineScope(Dispatchers.IO).launch {
                            try {
                                APIClient.scheduleApi.deleteSchedule(schedule.scheduleID)
                                withContext(Dispatchers.Main) {
                                    adapter.removeItem(schedule)
                                }
                            } catch (e: Exception) {
                                Log.e("Calendar", "Failed to delete: ${e.message}")
                            }
                        }
                        true
                    }
                    else -> false
                }
            }
            popup.show()
        }

        binding.schedulRecyclerView.layoutManager = LinearLayoutManager(this)
        binding.schedulRecyclerView.adapter = adapter

        reloadScheduleList()
    }

    private fun reloadScheduleList() {
        student?.let { stu ->
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val schedules = APIClient.scheduleApi.getSchedulesByStudent(stu.id)
                    val markedDates = schedules.mapNotNull { schedule ->
                        try {
                            val parts = schedule.startDate.split("-").map { it.toInt() }
                            CalendarDay.from(parts[0], parts[1], parts[2])
                        } catch (e: Exception) {
                            null
                        }
                    }
                    withContext(Dispatchers.Main) {
                        adapter.submitList(schedules)
                        binding.calendarView.addDecorator(object : DayViewDecorator {
                            override fun shouldDecorate(day: CalendarDay): Boolean {
                                return day == CalendarDay.today()
                            }
                            override fun decorate(view: DayViewFacade) {
                                view.setBackgroundDrawable(ContextCompat.getDrawable(this@Calendar, R.drawable.date_today_circle)!!)
                            }
                        })
                    }
                } catch (e: Exception) {
                    Log.e("Calendar", "Failed to fetch schedules: ${e.message}")
                }
            }
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

    override fun onBackPressed() {
        super.onBackPressed()
        finishAffinity()
    }
}