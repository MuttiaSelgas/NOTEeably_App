package com.example.noteably.network

import com.example.noteably.dto.LoginRequest
import com.example.noteably.dto.LoginResponse
import com.example.noteably.dto.RegisterRequest
import com.example.noteably.model.Student
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.*

interface APIService {

    @POST("api/students/register")
    fun register(@Body request: RegisterRequest): Call<Student>

    @POST("api/students/login")
    fun loginStudent(@Body request: LoginRequest): Call<LoginResponse>

    @GET("api/students/find/{studentId}")
    suspend fun getStudent(
        @Path("studentId") studentId: String
    ): Response<Student>
}
