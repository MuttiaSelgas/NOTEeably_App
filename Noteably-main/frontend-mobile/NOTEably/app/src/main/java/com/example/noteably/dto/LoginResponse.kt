package com.example.noteably.dto

import com.example.noteably.model.Student

data class LoginResponse(
    val token: String,
    val student: Student
)