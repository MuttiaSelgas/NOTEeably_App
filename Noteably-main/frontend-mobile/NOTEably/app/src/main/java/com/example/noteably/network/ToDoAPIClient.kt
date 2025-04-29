package com.example.noteably.api_client

import android.content.Context
import com.example.noteably.api_service.ToDoAPIService
import com.example.noteably.network.AuthInterceptor
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ToDoAPIClient {
    private const val BASE_URL = "http://10.0.2.2:8080/api/ToDoList/"

    private var retrofit: Retrofit? = null

    fun getApiService(context: Context): ToDoAPIService {
        if (retrofit == null) {
            val sharedPref = context.getSharedPreferences("NoteablyPrefs", Context.MODE_PRIVATE)
            val token = sharedPref.getString("jwt_token", null)

            val okHttpClient = OkHttpClient.Builder()
                .addInterceptor(AuthInterceptor(token ?: ""))
                .build()

            retrofit = Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(okHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
        }

        return retrofit!!.create(ToDoAPIService::class.java)
    }
}