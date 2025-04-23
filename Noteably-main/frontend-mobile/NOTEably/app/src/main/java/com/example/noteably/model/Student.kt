package com.example.noteably.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Student(
    val studentId: String,
    val name: String,
    val course: String,
    val contactNumber: String,
    val email: String,
    val profilePicture: String? = null,
    val jwtToken: String? = null
) : Parcelable
