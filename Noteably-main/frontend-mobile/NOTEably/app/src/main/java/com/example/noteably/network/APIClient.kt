package com.example.noteably.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object APIClient {
    private const val BASE_URL = "http://10.0.2.2:8080/api/students/"

    val apiService: APIService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL) // <- Must end with "/"
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(APIService::class.java)
    }
}