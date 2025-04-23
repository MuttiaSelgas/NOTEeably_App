package com.example.noteably.network

import com.example.noteably.model.ToDo
import com.example.noteably.model.ToDoRequest
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path


interface ToDoAPIService {
    @GET("api/TodoList/getByStudent/{studentId}")
    fun getTasks(@Path("studentId") studentId: Int): Call<List<ToDo>>

    @POST("api/TodoList/postListRecord")
    suspend fun addTask(@Body task: ToDoRequest): Response<Void>

    @PUT("api/TodoList/putList/{id}")
    fun updateTask(@Path("id") id: Int, @Body task: ToDo): Call<ToDo>

    @DELETE("api/TodoList/deleteList/{id}")
    fun deleteTask(@Path("id") id: Int): Call<String>
}