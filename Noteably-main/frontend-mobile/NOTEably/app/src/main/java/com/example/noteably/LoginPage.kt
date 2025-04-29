package com.example.noteably

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.text.InputType
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.noteably.model.LoginRequest
import com.example.noteably.model.LoginResponse
import com.example.noteably.model.Student
import com.example.noteably.network.APIClient
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginPage : AppCompatActivity() {

    private var isPasswordVisible = false
    private val handler = Handler(Looper.getMainLooper())

    private lateinit var emailField: EditText
    private lateinit var passwordField: TextInputEditText
    private lateinit var loginButton: Button
    private lateinit var signupLink: TextView
    private lateinit var passwordLayout: TextInputLayout
    private lateinit var mikuImage: ImageView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login_page)

        initViews()
        setupSignupNavigation()
        setupPasswordVisibilityToggle()
        setupLogin()
    }

    private fun initViews() {
        emailField = findViewById(R.id.email)
        passwordField = findViewById(R.id.password)
        loginButton = findViewById(R.id.loginbttn1)
        signupLink = findViewById(R.id.signuplink)
        passwordLayout = findViewById(R.id.passwordLayout)
        mikuImage = findViewById(R.id.imageView4)
    }

    private fun setupSignupNavigation() {
        signupLink.setOnClickListener {
            startActivity(Intent(this, RegisterPage::class.java))
            finish()
        }
    }

    private fun setupPasswordVisibilityToggle() {
        passwordLayout.setEndIconOnClickListener {
            if (isPasswordVisible) {
                mikuImage.setImageResource(R.drawable.mikushow)
            } else {
                mikuImage.setImageResource(R.drawable.mikuhide)
            }

            isPasswordVisible = !isPasswordVisible

            handler.postDelayed({
                mikuImage.setImageResource(
                    if (isPasswordVisible) R.drawable.mikuhidetransition else R.drawable.mikushowtransition
                )
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

    private fun setupLogin() {
        loginButton.setOnClickListener {
            val email = emailField.text.toString().trim()
            val password = passwordField.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val loginRequest = LoginRequest(email, password)

            APIClient.api.loginStudent(loginRequest)
                .enqueue(object : Callback<LoginResponse> {
                    override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                        if (response.isSuccessful) {
                            val loginResponse = response.body()
                            if (loginResponse?.student != null) {
                                handleSuccessfulLogin(loginResponse)
                            } else {
                                showToast("Failed to load student data")
                                Log.e("LoginPage", "Student object is null in login response")
                            }
                        } else {
                            showToast("Login failed: ${response.message()}")
                            Log.e("LoginPage", "Login failed: ${response.errorBody()?.string()}")
                        }
                    }

                    override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                        showToast("Login failed: ${t.message}")
                        Log.e("LoginPage", "Login error: ${t.message}", t)
                    }
                })
        }
    }

    private fun handleSuccessfulLogin(loginResponse: LoginResponse) {
        val student = loginResponse.student
        val jwtToken = loginResponse.token

        // Log JWT token for debugging
        Log.d("LoginPage", "Received JWT Token: $jwtToken")

        // Check if JWT token is null or empty
        if (jwtToken.isNullOrEmpty()) {
            Log.e("LoginPage", "JWT Token is null or empty!")
            Toast.makeText(this, "Login failed: Invalid token", Toast.LENGTH_SHORT).show()
            return
        }

        Log.d("LoginPage", "Login successful. Student ID: ${student.studentId}")
        Toast.makeText(this, "Welcome ${student.name}!", Toast.LENGTH_SHORT).show()

        // 🌟 Save JWT token
        val sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
        sharedPreferences.edit()
            .putString("jwt_token", jwtToken)
            .apply()

        val studentWithToken = student.copy(jwtToken = jwtToken)
        val intentDashboard = Intent(this, Dashboard::class.java).apply {
            putExtra("student", studentWithToken)
        }
        startActivity(intentDashboard)
        finish()
    }

    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}