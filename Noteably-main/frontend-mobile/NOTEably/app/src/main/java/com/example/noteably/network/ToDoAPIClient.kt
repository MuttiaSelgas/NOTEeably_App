package com.example.noteably.network

import android.content.Context
import android.util.Log
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ToDoAPIClient {
    private const val BASE_URL = "http://192.168.68.106:8080/api/TodoList"

    private lateinit var retrofit: Retrofit
    lateinit var instance: ToDoAPIService
        private set

    fun initClient(context: Context) {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val client = OkHttpClient.Builder()
            .addInterceptor { chain ->
                val sharedPrefs = context.getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE)
                val token = sharedPrefs.getString("jwt_token", null)

                val originalRequest = chain.request()
                val requestBuilder = originalRequest.newBuilder()

                Log.d("ToDoAPIClient", "JWT Token: $token")
                if (!token.isNullOrEmpty()) {
                    requestBuilder.addHeader("Authorization", "Bearer $token")
                }

                val request = requestBuilder.build()
                chain.proceed(request)
            }
            .addInterceptor(logging)
            .build()

        retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        instance = retrofit.create(ToDoAPIService::class.java)
    }
}
