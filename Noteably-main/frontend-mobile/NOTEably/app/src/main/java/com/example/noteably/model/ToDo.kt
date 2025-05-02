package com.example.noteably.model

import com.google.gson.annotations.SerializedName

data class ToDo(
    val todolistID: Int? = null,
    val title: String,
    val sched: Schedule? = null,
    val description: String,
    @SerializedName("studentId") val studentId: Int
)

{
    data class Schedule(val scheduleID: Int)
}