package com.nickolss.madeforyou.data

import com.nickolss.madeforyou.servicos.ApiService
import com.nickolss.madeforyou.components.Habit
import com.nickolss.madeforyou.components.HabitRequest
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class HabitRepository {

    private val client: OkHttpClient by lazy {
        val logging = HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BODY }
        OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(180, TimeUnit.SECONDS)
            .readTimeout(180, TimeUnit.SECONDS)
            .writeTimeout(180, TimeUnit.SECONDS)
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

    suspend fun getHabits(userId: String): List<Habit> {
        return try {
            api.getHabits(userId)
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }

    suspend fun saveHabit(habit: Habit): Boolean {
        return try {
            // Prepara o Request Limpo
            val request = HabitRequest(
                name = habit.name,
                description = habit.description,
                color = habit.color ?: "#818CF8",
                frequency = habit.frequency,
                targetDays = habit.targetDays
            )

            val response = if (habit.id == null) {
                val uid = habit.userId ?: ""
                api.createHabit(uid, request)
            } else {
                // Atualização
                if (habit.userId != null) {
                    api.updateHabit(habit.id, habit.userId, request)
                } else return false
            }

            if (!response.isSuccessful) {
                println("ERRO HABITO (${response.code()}): ${response.errorBody()?.string()}")
            }
            response.isSuccessful
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    suspend fun deleteHabit(id: Int, userId: String): Boolean {
        return try {
            val response = api.deleteHabit(id, userId)
            response.isSuccessful
        } catch (e: Exception) {
            false
        }
    }
}