package com.example.noteably.network

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import com.example.noteably.util.TokenProvider


object APIClient {
    internal const val BASE_URL = "http://192.168.68.106:8080/"

    val retrofit by lazy {
        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val client = OkHttpClient.Builder()
            .addInterceptor(logging)
            .addInterceptor { chain ->
                val requestBuilder = chain.request().newBuilder()

                // Inject token from a shared object (see below)
                if (TokenProvider.token != null) {
                    requestBuilder.addHeader("Authorization", "Bearer ${TokenProvider.token}")
                }

                chain.proceed(requestBuilder.build())
            }
            .build()

        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    val api: APIService by lazy {
        retrofit.create(APIService::class.java)
    }

    val scheduleApi: ScheduleAPIService by lazy {
        retrofit.create(ScheduleAPIService::class.java)
    }
}