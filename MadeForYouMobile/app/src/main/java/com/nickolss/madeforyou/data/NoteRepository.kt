package com.nickolss.madeforyou.data

import com.nickolss.madeforyou.servicos.ApiService
import com.nickolss.madeforyou.components.Note
import com.nickolss.madeforyou.components.NoteRequest
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class NoteRepository {

    private val client: OkHttpClient by lazy {
        val logging = HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BODY }
        OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(120, TimeUnit.SECONDS) // Timeout seguro
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

    suspend fun getNotes(userId: String): List<Note> {
        return try {
            api.getNotes(userId)
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun saveNote(note: Note): Boolean {
        return try {
            val request = NoteRequest(
                title = note.title,
                content = note.content,
                category = note.category,
                tags = note.tags,
                isPinned = note.isPinned,
                color = note.color ?: "#818CF8"
            )

            val response = if (note.id == null) {
                val uid = note.userId ?: ""
                api.createNote(uid, request)
            } else {
                if (note.userId != null) {
                    api.updateNote(note.id, note.userId, request)
                } else return false
            }
            response.isSuccessful
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    suspend fun deleteNote(id: Int, userId: String) = try {
        api.deleteNote(id, userId).isSuccessful
    } catch (e: Exception) { false }
}