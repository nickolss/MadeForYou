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

    // 1. Configurar o Cliente HTTP com Timeout maior (para a Render acordar)
    private val client: OkHttpClient by lazy {
        val logging = HttpLoggingInterceptor()
        logging.setLevel(HttpLoggingInterceptor.Level.BODY) // Isso vai mostrar o JSON no Logcat

        OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(60, TimeUnit.SECONDS) // Aumenta para 60 segundos
            .readTimeout(60, TimeUnit.SECONDS)    // Aumenta para 60 segundos
            .writeTimeout(60, TimeUnit.SECONDS)
            .build()
    }

    // 2. Configurar o Retrofit usando esse cliente
    private val api: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl("https://made-for-you.onrender.com/")
            .client(client) // <--- Importante: Adicione o cliente aqui
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }



    // Buscar Tarefas
    suspend fun getTasks(userId: String): List<Task> {
        return try {
            api.getTasks(userId)
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }

    // Salvar (Criar ou Atualizar)
    suspend fun saveTask(task: Task): Boolean {
        return try {
            val response = if (task.id == null) {
                // --- CRIAÇÃO ---
                // Preparamos o objeto EXATO que o Swagger pede
                val requestBody = TaskRequest(
                    description = task.description,
                    isCompleted = task.isCompleted,
                    priority = task.priority,
                    category = task.category,
                    dueDate = task.dueDate
                )

                // Enviamos: userId na URL, requestBody no JSON
                val uid = task.userId ?: ""
                api.createTask(uid, requestBody)

            } else {
                // --- ATUALIZAÇÃO ---
                api.updateTask(task.id, task)
            }

            if (!response.isSuccessful) {
                // Dica: Isso imprime o erro real do servidor
                println("ERRO API (${response.code()}): ${response.errorBody()?.string()}")
            }

            response.isSuccessful
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    // Deletar
    // MUDANÇA: Agora recebe taskId E userId
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