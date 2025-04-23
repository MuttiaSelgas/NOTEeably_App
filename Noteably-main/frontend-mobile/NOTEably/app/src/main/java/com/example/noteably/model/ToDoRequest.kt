package com.example.noteably.model

data class ToDoRequest(
    val studentId: String,
    val title: String,
    val schedule: String,
    val description: String
)
