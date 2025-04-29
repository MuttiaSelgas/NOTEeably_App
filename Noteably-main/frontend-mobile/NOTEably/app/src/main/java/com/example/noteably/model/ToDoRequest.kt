package com.example.noteably.model

data class ToDoRequest(
    val title: String,
    //val schedule: String,
    val description: String,
    val studentId: String?
)
