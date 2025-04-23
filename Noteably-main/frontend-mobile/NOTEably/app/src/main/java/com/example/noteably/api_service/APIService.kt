package com.example.noteably.api_service

import com.example.noteably.model.LoginResponse
import com.example.noteably.model.RegisterRequest
import com.example.noteably.model.Student
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.*

interface APIService {

    @POST("register")
    fun register(@Body request: RegisterRequest): Call<Student>

    @POST("login")
    fun loginStudent(@Body credentials: Map<String, String>): Call<LoginResponse>

    @GET("find/{studentId}")
    suspend fun getStudent(@Path("studentId") studentId: String): Response<Student>
}
