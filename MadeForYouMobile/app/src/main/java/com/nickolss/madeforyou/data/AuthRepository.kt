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

    // instancia do firebase p/ gerenciar sessao
    private val firebaseAuth: FirebaseAuth = FirebaseAuth.getInstance()

    // CONFIGURAÇÃO DO RETROFIT
    private val api: ApiService by lazy { // "by lazy" para que ele so seja criado na primeira vez que for usado
        val logging = HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BODY }
        val client = OkHttpClient.Builder()
            .addInterceptor(logging) // timeouts para lidar com o delay do render
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .build()

        Retrofit.Builder()
            .baseUrl("https://made-for-you.onrender.com/") // back
            .client(client)
            .addConverterFactory(GsonConverterFactory.create()) // converte JSON para objetos kotlin
            .build()
            .create(ApiService::class.java)
    }

    // atalho p/ verificar se o user ja esta logado ao abrir o app
    val currentUser: FirebaseUser?
        get() = firebaseAuth.currentUser

    // LOGIN
    suspend fun login(email: String, pass: String): Result<FirebaseUser> {
        return try {
            // Autentica no Firebase
            val result = firebaseAuth.signInWithEmailAndPassword(email, pass).await()
            val user = result.user

            if (user != null) {
                // Se deu certo, Sincroniza com o Postgres
                val success = syncWithBackend(user, null) // Nome null, pega do email
                if (success) {
                    Result.success(user)
                } else { // se falhar, retorna o erro
                    Result.failure(Exception("Login no Firebase ok, mas falha ao sincronizar com Banco de Dados."))
                }
            } else {
                Result.failure(Exception("Erro ao obter usuário"))
            }
        } catch (e: Exception) {
            Result.failure(e) // captura erros
        }
    }

    // REGISTRO
    suspend fun register(email: String, pass: String, name: String): Result<FirebaseUser> {
        return try {
            // Cria o user no Firebase
            val result = firebaseAuth.createUserWithEmailAndPassword(email, pass).await()
            val user = result.user

            if (user != null) {
                // Se deu certo, Sincroniza com o Postgres enviando o Nome
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

    // FUNÇÃO AUXILIAR DE SYNC
    private suspend fun syncWithBackend(user: FirebaseUser, name: String?): Boolean {
        return try {
            /* Usa o nome passado no registro (name)
             Se for null, tenta o DisplayName do Firebase
             Se for null, pega a parte antes do @ do email
             Se tudo falhar, chama de "User" */
            val finalName = name ?: user.displayName ?: user.email?.split("@")?.get(0) ?: "User"

            val request = UserSyncRequest(
                id = user.uid, // id unico do firebase = chave primeira no back
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

    // SAIR
    fun logout() {
        firebaseAuth.signOut()
    }
}
