package com.example.noteably.model

data class RegisterRequest(
    val name: String,
    val studentId: String = "", // can be auto-generated on backend
    val course: String,
    val contactNumber: String,
    val email: String,
    val password: String,
    val profilePicture: String? = null
)

