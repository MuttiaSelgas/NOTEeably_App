package com.example.noteably

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.text.InputType
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.noteably.model.LoginResponse
import com.example.noteably.api_client.APIClient
import com.example.noteably.model.Student
import com.google.android.material.textfield.TextInputEditText
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import com.google.android.material.textfield.TextInputLayout

class LoginPage : AppCompatActivity() {

    private var isPasswordVisible = false
    private val handler = Handler(Looper.getMainLooper())

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login_page)

        val emailField = findViewById<EditText>(R.id.email)
        val passwordField = findViewById<EditText>(R.id.password)
        val loginButton = findViewById<Button>(R.id.loginbttn1)
        val signupLink = findViewById<TextView>(R.id.signuplink)
        val passwordLayout = findViewById<TextInputLayout>(R.id.passwordLayout)
        val mikuImage = findViewById<ImageView>(R.id.imageView4)
        val passwordEditText = findViewById<TextInputEditText>(R.id.password)

        // Navigate to Register Page
        signupLink.setOnClickListener {
            startActivity(Intent(this, RegisterPage::class.java))
            finish()
        }

        // Password visibility toggle logic
        passwordLayout.setEndIconOnClickListener {
            // First, show the initial image depending on the current state
            if (isPasswordVisible) {
                mikuImage.setImageResource(R.drawable.mikushow)  // Show mikushow initially
            } else {
                mikuImage.setImageResource(R.drawable.mikuhide)  // Show mikuhide initially
            }

            // Toggle the visibility flag
            isPasswordVisible = !isPasswordVisible

            // Transition sequence with images (keeping transition intact)
            handler.postDelayed({
                if (isPasswordVisible) {
                    mikuImage.setImageResource(R.drawable.mikuhidetransition)  // Transition to in-between
                } else {
                    mikuImage.setImageResource(R.drawable.mikushowtransition)  // Transition to in-between
                }
            }, 150)

            // Delay to switch to the in-between image and finally show the target image
            handler.postDelayed({
                mikuImage.setImageResource(R.drawable.mikuinbetween)  // Show in-between image
            }, 300)

            // Delay to switch to the final image (either mikuhide or mikushow)
            handler.postDelayed({
                if (isPasswordVisible) {
                    passwordEditText.inputType =
                        InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD
                    mikuImage.setImageResource(R.drawable.mikushow)  // Show mikushow after transition
                } else {
                    passwordEditText.inputType =
                        InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
                    mikuImage.setImageResource(R.drawable.mikuhide)  // Show mikuhide after transition
                }

                // Move the cursor to the end of the text
                passwordEditText.setSelection(passwordEditText.text?.length ?: 0)
            }, 500)
        }

        // Login Button Clicked
        loginButton.setOnClickListener {
            val email = emailField.text.toString().trim()
            val password = passwordField.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT)
                    .show()
                return@setOnClickListener
            }

            val credentials = mapOf("email" to email, "password" to password)

            APIClient.apiService.loginStudent(credentials)
                .enqueue(object : Callback<LoginResponse> {
                    override fun onResponse(
                        call: Call<LoginResponse>,
                        response: Response<LoginResponse>
                    ) {
                        if (response.isSuccessful) {
                            val loginResponse = response.body()

                            if (loginResponse != null && loginResponse.student != null) {
                                val student = loginResponse.student
                                val jwtToken = loginResponse.jwtToken

                                Log.d("LoginPage", "Login successful. Student ID: ${student.studentId}")
                                Toast.makeText(this@LoginPage, "Welcome ${student.name}!", Toast.LENGTH_SHORT).show()

                                val studentWithToken = Student(
                                    studentId = student.studentId,
                                    name = student.name,
                                    course = student.course,
                                    contactNumber = student.contactNumber,
                                    email = student.email,
                                    profilePicture = student.profilePicture,
                                    jwtToken = jwtToken
                                )

                                val intent = Intent(this@LoginPage, Dashboard::class.java)
                                intent.putExtra("student", studentWithToken)
                                startActivity(intent)
                                finish()
                            } else {
                                Log.e("LoginPage", "Student object is null in login response")
                                Toast.makeText(this@LoginPage, "Failed to load student data", Toast.LENGTH_SHORT).show()
                            }
                        }
                    }

                    override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                        Log.e("LoginPage", "Login error: ${t.message}")
                        Toast.makeText(
                            this@LoginPage,
                            "Login failed: ${t.message}",
                            Toast.LENGTH_LONG
                        ).show()
                    }
                })
        }
    }
}
