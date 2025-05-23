package com.example.noteably.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Student(
    val id: Int,
    val name: String,
    val course: String,
    val contactNumber: String,
    val email: String,
    val profilePicture: String? = null,
    val jwtToken: String? = null,
    val studentId: String,
) : Parcelable
