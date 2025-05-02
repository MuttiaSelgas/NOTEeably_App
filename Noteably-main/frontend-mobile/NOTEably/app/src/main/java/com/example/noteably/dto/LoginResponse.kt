package com.example.noteably.model

data class LoginResponse(
    val token: String,
    val student: Student
)