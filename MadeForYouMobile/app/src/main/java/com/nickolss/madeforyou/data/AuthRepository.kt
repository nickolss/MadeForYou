package com.nickolss.madeforyou.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.nickolss.madeforyou.servicos.ApiService
import com.nickolss.madeforyou.components.UserSyncRequest
import kotlinx.coroutines.tasks.await
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class AuthRepository {
    private val firebaseAuth: FirebaseAuth = FirebaseAuth.getInstance()

    // --- CONFIGURAÇÃO DO RETROFIT (Cópia do TaskRepository) ---
    private val api: ApiService by lazy {
        val logging = HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BODY }
        val client = OkHttpClient.Builder()
            .addInterceptor(logging)
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .build()

        Retrofit.Builder()
            .baseUrl("https://made-for-you.onrender.com/")
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }

    val currentUser: FirebaseUser?
        get() = firebaseAuth.currentUser

    // --- LOGIN ---
    suspend fun login(email: String, pass: String): Result<FirebaseUser> {
        return try {
            // 1. Autentica no Firebase
            val result = firebaseAuth.signInWithEmailAndPassword(email, pass).await()
            val user = result.user

            if (user != null) {
                // 2. Se deu certo, Sincroniza com o Postgres
                val success = syncWithBackend(user, null) // Nome null, pega do email
                if (success) {
                    Result.success(user)
                } else {
                    Result.failure(Exception("Login no Firebase ok, mas falha ao sincronizar com Banco de Dados."))
                }
            } else {
                Result.failure(Exception("Erro ao obter usuário"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // --- REGISTRO ---
    suspend fun register(email: String, pass: String, name: String): Result<FirebaseUser> {
        return try {
            // 1. Cria no Firebase
            val result = firebaseAuth.createUserWithEmailAndPassword(email, pass).await()
            val user = result.user

            if (user != null) {
                // 2. Se deu certo, Sincroniza com o Postgres enviando o Nome
                val success = syncWithBackend(user, name)
                if (success) {
                    Result.success(user)
                } else {
                    Result.failure(Exception("Conta criada, mas erro ao salvar no Banco de Dados."))
                }
            } else {
                Result.failure(Exception("Falha ao criar usuário"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // --- FUNÇÃO AUXILIAR DE SYNC (A Lógica do TypeScript traduzida) ---
    private suspend fun syncWithBackend(user: FirebaseUser, name: String?): Boolean {
        return try {
            // Lógica: displayName || email.split('@')[0]
            val finalName = name ?: user.displayName ?: user.email?.split("@")?.get(0) ?: "User"

            val request = UserSyncRequest(
                id = user.uid,
                email = user.email ?: "",
                displayName = finalName
            )

            val response = api.syncUser(request)

            if (!response.isSuccessful) {
                println("ERRO SYNC (${response.code()}): ${response.errorBody()?.string()}")
            }
            response.isSuccessful
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    fun logout() {
        firebaseAuth.signOut()
    }
}
