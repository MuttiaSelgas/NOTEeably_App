package com.example.noteably.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize


@Parcelize
data class ScheduleModel(
    val scheduleID: Int = 0,
    val studentId: Int,
    val title: String,
    val priority: String,
    val colorCode: String,
    val startDate: String,
    val endDate: String?,
) : Parcelable
