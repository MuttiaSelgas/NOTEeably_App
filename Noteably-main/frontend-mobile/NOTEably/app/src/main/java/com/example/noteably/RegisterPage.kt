package com.example.noteably

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.noteably.model.RegisterRequest
import com.example.noteably.model.Student
import com.example.noteably.api_client.APIClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegisterPage : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register_page)

        val usernameField = findViewById<EditText>(R.id.username)
        val emailField = findViewById<EditText>(R.id.email)
        val passwordField = findViewById<EditText>(R.id.password)
        val registerButton = findViewById<Button>(R.id.registerbttn)
        val loginLink = findViewById<TextView>(R.id.loginlink)

        registerButton.setOnClickListener {
            val username = usernameField.text.toString().trim()
            val email = emailField.text.toString().trim()
            val password = passwordField.text.toString().trim()

            if (username.isEmpty() || email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val registerRequest = RegisterRequest(
                name = username,
                email = email,
                password = password,
                course = "",           // Optional
                contactNumber = ""     // Optional
            )

            APIClient.apiService.register(registerRequest).enqueue(object : Callback<Student> {
                override fun onResponse(call: Call<Student>, response: Response<Student>) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@RegisterPage, "Registration successful!", Toast.LENGTH_SHORT).show()
                        startActivity(Intent(this@RegisterPage, LoginPage::class.java))
                        finish()
                    } else {
                        Toast.makeText(this@RegisterPage, "Registration failed: ${response.code()}", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<Student>, t: Throwable) {
                    Toast.makeText(this@RegisterPage, "Network error: ${t.message}", Toast.LENGTH_LONG).show()
                }
            })
        }

        loginLink.setOnClickListener {
            val loginIntent = Intent(this, LoginPage::class.java)
            startActivity(loginIntent)
            finish()
        }
    }
}
