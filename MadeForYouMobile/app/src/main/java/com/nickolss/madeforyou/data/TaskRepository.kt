package com.nickolss.madeforyou.data

import com.nickolss.madeforyou.servicos.ApiService
import com.nickolss.madeforyou.components.Task
import com.nickolss.madeforyou.components.TaskRequest
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class TaskRepository {

    // configuracao do cliente http
    private val client: OkHttpClient by lazy {
        val logging = HttpLoggingInterceptor()
        logging.setLevel(HttpLoggingInterceptor.Level.BODY) 

        // timeout para lidar com o delay do render
        OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(60, TimeUnit.SECONDS) 
            .readTimeout(60, TimeUnit.SECONDS)    
            .build()
    }

    // instancia da interface da api
    private val api: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl("https://made-for-you.onrender.com/")
            .client(client) // <--- Importante: Adicione o cliente aqui
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }



    // BUSCAR TAREFAS
    suspend fun getTasks(userId: String): List<Task> {
        return try {
            api.getTasks(userId)
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }

    // SALVAR (CRIAR OU ATUALIZAR)
    suspend fun saveTask(task: Task): Boolean {
        return try {
            val response = if (task.id == null) {
                
                // CRIACAO
                val requestBody = TaskRequest(
                    description = task.description,
                    isCompleted = task.isCompleted,
                    priority = task.priority,
                    category = task.category,
                    dueDate = task.dueDate
                )

                // Envia o userId na URL e os dados no body
                val uid = task.userId ?: ""
                api.createTask(uid, requestBody)

            } else {
                // ATUALIZACAO
                api.updateTask(task.id, task)
            }

            if (!response.isSuccessful) {
                println("ERRO API (${response.code()}): ${response.errorBody()?.string()}")
            }

            response.isSuccessful
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    // DELETAR
    suspend fun deleteTask(taskId: Int, userId: String): Boolean {
        return try {
            val response = api.deleteTask(taskId, userId)

            if (!response.isSuccessful) {
                println("ERRO DELETE (${response.code()}): ${response.errorBody()?.string()}")
            }

            response.isSuccessful
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}
