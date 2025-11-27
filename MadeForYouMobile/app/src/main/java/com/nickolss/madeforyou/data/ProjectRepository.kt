package com.nickolss.madeforyou.data

import com.nickolss.madeforyou.servicos.ApiService
import com.nickolss.madeforyou.components.Project
import com.nickolss.madeforyou.components.ProjectRequest
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class ProjectRepository {

    private val client: OkHttpClient by lazy {
        val logging = HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BODY }
        OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(120, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .writeTimeout(120, TimeUnit.SECONDS)
            .build()
    }

    private val api: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl("https://made-for-you.onrender.com/")
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }

    // LISTAGEM
    suspend fun getProjects(userId: String): List<Project> {
        return try {
            api.getProjects(userId)
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }

    // SALVAR
    suspend fun saveProject(project: Project): Boolean {
        return try {
            // Conversão para o Request Limpo
            val request = ProjectRequest(
                name = project.name,
                description = project.description,
                progress = project.progress,
                status = project.status, 
                priority = project.priority,
                startDate = project.startDate,
                dueDate = project.dueDate,
                color = project.color ?: "#818CF8"
            )

            // Se for criação (ID nulo), usa POST
            val response = if (project.id == null) {
                val uid = project.userId ?: ""
                api.createProject(uid, request)
            } else {
                return false
            }

            if (!response.isSuccessful) {
                println("ERRO PROJETO (${response.code()}): ${response.errorBody()?.string()}")
            }
            response.isSuccessful
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    // DELETAR
    suspend fun deleteProject(id: Int, userId: String): Boolean {
        return try {
            val response = api.deleteProject(id, userId)
            response.isSuccessful
        } catch (e: Exception) {
            false
        }
    }

    // ATUALIZAR
    suspend fun updateProject(project: Project): Boolean {
        return try {
            // Prepara o JSON limpo
            val request = ProjectRequest(
                name = project.name,
                description = project.description,
                progress = project.progress,
                status = project.status,
                priority = project.priority,
                startDate = project.startDate,
                dueDate = project.dueDate,
                color = project.color ?: "#818CF8"
            )

            // so atualiza se tiver ID do projeto e do dono
            if (project.id != null && project.userId != null) {
                val response = api.updateProject(project.id, project.userId, request)
                response.isSuccessful
            } else {
                false
            }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}
