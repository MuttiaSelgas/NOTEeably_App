package com.example.noteably

import android.os.Bundle
import android.util.Log
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

        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Load profile image
        Glide.with(this)
            .load(R.drawable.blueprofile)
            .override(140, 140)
            .into(binding.imageView)

        // Load student info from backend
        fetchStudentData("1") // Replace "1" with the real student ID if needed
    }

    private fun fetchStudentData(studentId: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val response = APIClient.apiService.getStudent(studentId)
                if (response.isSuccessful) {
                    val student = response.body()
                    withContext(Dispatchers.Main) {
                        binding.studentName.text = student?.name ?: "No Name"
                        binding.studentId.text = student?.studentId ?: "N/A"
                    }
                } else {
                    Log.e("Dashboard", "API call failed with code: ${response.code()}")
                }
            } catch (e: Exception) {
                Log.e("Dashboard", "Error fetching student data: ${e.message}")
            }
        }
    }

    override fun onBackPressed() {
        super.onBackPressed()
        // Exit the app completely
        finishAffinity() // closes all activities in the stack
    }
}
