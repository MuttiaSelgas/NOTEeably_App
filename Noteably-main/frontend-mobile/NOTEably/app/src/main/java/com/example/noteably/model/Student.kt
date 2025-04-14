package com.example.noteably.model

data class Student(
    val id: Int,
    val studentId: String,
    val name: String,
    val course: String,
    val contactNumber: String,
    val email: String,
    val profilePicture: String? = null
)
