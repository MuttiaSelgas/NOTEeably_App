package com.example.noteably.model

data class LoginResponse(
    val jwtToken: String,
    val student: Student
)
