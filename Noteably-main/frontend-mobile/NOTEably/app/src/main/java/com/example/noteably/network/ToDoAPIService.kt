package com.example.noteably.network

import com.example.noteably.model.ToDo
import retrofit2.Call
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
    fun addTask(@Body task: ToDo): Call<ToDo>

    @PUT("api/TodoList/putList/{id}")
    fun updateTask(@Path("id") id: Int, @Body task: ToDo): Call<ToDo>

    @DELETE("api/TodoList/deleteList/{id}")
    fun deleteTask(@Path("id") id: Int): Call<String>
}