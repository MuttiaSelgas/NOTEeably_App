package com.example.noteably.repository

import com.example.noteably.model.ScheduleModel
import com.example.noteably.network.ScheduleAPIService

class ScheduleRepository(private val api: ScheduleAPIService) {
    suspend fun getSchedulesByStudent(studentId: Int): List<ScheduleModel> {
        return api.getSchedulesByStudent(studentId)
    }
}
