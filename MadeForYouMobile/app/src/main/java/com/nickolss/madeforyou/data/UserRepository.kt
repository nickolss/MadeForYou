package com.nickolss.madeforyou.data

import com.nickolss.madeforyou.servicos.ApiService
import com.nickolss.madeforyou.components.UserProfile
import com.nickolss.madeforyou.components.UserUpdateRequest
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class UserRepository {

    private val client: OkHttpClient by lazy {
        val logging = HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BODY }
        OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
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

    suspend fun getUserProfile(userId: String): UserProfile? {
        return try {
            api.getUserProfile(userId)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    suspend fun updateUserProfile(userId: String, firstName: String, lastName: String, displayName: String): Boolean {
        return try {
            val request = UserUpdateRequest(
                firstName = firstName,
                lastName = lastName,
                displayName = displayName, // Opcional, mas bom manter sincronizado
                avatarUrl = null // Não estamos tratando upload de imagem por enquanto
            )
            api.updateUserProfile(userId, request)
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}