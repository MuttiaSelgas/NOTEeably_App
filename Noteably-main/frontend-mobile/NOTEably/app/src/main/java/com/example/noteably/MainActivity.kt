package com.example.noteably

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Thread.sleep(3000)
        installSplashScreen()
        setContentView(R.layout.activity_main)

        val loginButton = findViewById<Button>(R.id.loginbttn)
        loginButton.setOnClickListener {
            val loginIntent = Intent(this, LoginPage::class.java)
            startActivity(loginIntent)
        }

        val registerButton = findViewById<Button>(R.id.registerbttn)
        registerButton.setOnClickListener {
            val registerIntent = Intent(this, RegisterPage::class.java)
            startActivity(registerIntent)
        }
    }
}