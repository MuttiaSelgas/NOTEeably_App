package com.example.noteably.network

import com.example.noteably.model.LoginRequest
import com.example.noteably.model.RegisterRequest
import com.example.noteably.model.Student
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.*

interface APIService {

    @POST("register")
    fun register(@Body request: RegisterRequest): Call<Student>

    @POST("login")
    fun loginStudent(@Body credentials: Map<String, String>): Call<Student>

    @GET("{id}")
    suspend fun getStudent(@Path("id") id: String): Response<Student>
}
