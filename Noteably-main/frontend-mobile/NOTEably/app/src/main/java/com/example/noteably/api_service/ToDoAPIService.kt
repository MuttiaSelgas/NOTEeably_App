package com.example.noteably.api_service

import com.example.noteably.model.ToDo
import com.example.noteably.model.ToDoRequest
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path


interface ToDoAPIService {
    @GET("api/TodoList/getByStudent/{studentId}")
    suspend fun getToDoListByStudentId(@Path("studentId") studentId: Int): Response<List<ToDo>>

    @POST("api/TodoList/postListRecord")
    suspend fun postToDoList(
        @Header("Authorization") token: String,
        @Body todo: ToDoRequest
    ): Response<ToDo>

    /*@PUT("/putList/{id}")
    fun updateTask(@Path("id") id: Int, @Body task: ToDo): Call<ToDo>*/

    @DELETE("/deleteList/{id}")
    fun deleteToDoList(@Path("id") id: Int): Call<String>
}