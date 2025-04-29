package com.example.noteably.model

data class ToDo(
    val todolistID: Int? = null,
    val title: String,
    //val schedule: String,
    val description: String,
    val studentId: Int
)
