package com.example.noteably.network

import com.example.noteably.model.ScheduleModel
import retrofit2.Response
import retrofit2.http.*

interface ScheduleAPIService {

    // ✅ Get schedules by specific student
    @GET("api/schedules/getByStudent/{studentId}")
    suspend fun getSchedulesByStudent(@Path("studentId") studentId: Int): List<ScheduleModel>

    // ✅ Create a schedule (optional todo list IDs)
    @POST("api/schedules/postSched")
    suspend fun createSchedule(
        @Body schedule: ScheduleModel,
        @Query("todoListIds") todoListIds: List<Int>? = null
    ): Response<ScheduleModel>

    @DELETE("api/schedules/deleteSched/{id}")
    suspend fun deleteSchedule(@Path("id") id: Int): Response<Void>

    @PUT("api/schedules/editSched/{id}")
    suspend fun updateSchedule(
        @Path("id") id: Int,
        @Body schedule: ScheduleModel
    ): Response<ScheduleModel>
}
