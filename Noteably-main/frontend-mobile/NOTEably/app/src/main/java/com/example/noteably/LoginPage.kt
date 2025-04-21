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
import com.example.noteably.model.Student
import com.example.noteably.network.APIClient
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

        // Navigate to Register Page
        signupLink.setOnClickListener {
            startActivity(Intent(this, RegisterPage::class.java))
            finish()
        }

        // Login Button Clicked
        loginButton.setOnClickListener {
            val email = emailField.text.toString().trim()
            val password = passwordField.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show()
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
                            val student = loginResponse?.student

                            Log.d(
                                "LoginPage",
                                "Login successful. Student ID: ${student?.studentId}"
                            )
                            Toast.makeText(
                                this@LoginPage,
                                "Welcome ${student?.name}!",
                                Toast.LENGTH_SHORT
                            ).show()

                            if (student != null) {
                                Log.d("LoginPage", "Login successful. Sending student: ${student.name} (${student.studentId})")

                                val intent = Intent(this@LoginPage, Dashboard::class.java)
                                intent.putExtra("student", student)  // sending full Student object
                                startActivity(intent)
                                finish()
                            } else {
                                Log.e("LoginPage", "Student object is null in login response")
                                Toast.makeText(this@LoginPage, "Failed to load student data", Toast.LENGTH_SHORT).show()
                            }

                        } else {
                            Log.e("LoginPage", "Login failed: ${response.code()}")
                            Toast.makeText(
                                this@LoginPage,
                                "Invalid credentials",
                                Toast.LENGTH_SHORT
                            ).show()
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

            // Miku Password Toggle with Transitions
            passwordLayout.setEndIconOnClickListener {
                if (isPasswordVisible) {
                    mikuImage.setImageResource(R.drawable.mikushow)
                } else {
                    mikuImage.setImageResource(R.drawable.mikuhide)
                }

                isPasswordVisible = !isPasswordVisible

                handler.postDelayed({
                    if (isPasswordVisible) {
                        mikuImage.setImageResource(R.drawable.mikuhidetransition)
                    } else {
                        mikuImage.setImageResource(R.drawable.mikushowtransition)
                    }
                }, 150)

                handler.postDelayed({
                    mikuImage.setImageResource(R.drawable.mikuinbetween)
                }, 300)

                handler.postDelayed({
                    if (isPasswordVisible) {
                        passwordField.inputType =
                            InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD
                        mikuImage.setImageResource(R.drawable.mikushow)
                    } else {
                        passwordField.inputType =
                            InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
                        mikuImage.setImageResource(R.drawable.mikuhide)
                    }
                    passwordField.setSelection(passwordField.text?.length ?: 0)
                }, 500)
            }
        }
    }
}