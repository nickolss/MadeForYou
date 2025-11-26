package com.nickolss.madeforyou.data

import com.nickolss.madeforyou.components.Account
import com.nickolss.madeforyou.components.AccountRequest
import com.nickolss.madeforyou.servicos.ApiService
import com.nickolss.madeforyou.components.Transaction
import com.nickolss.madeforyou.components.TransactionRequest
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

class FinanceRepository {

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

    // --- CONTAS ---
    suspend fun getAccounts(userId: String): List<Account> {
        return try {
            api.getAccounts(userId)
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun saveAccount(account: Account): Boolean {
        return try {
            val request = AccountRequest(
                name = account.name,
                type = account.type,
                balance = account.balance,
                bank = account.bank ?: ""
            )
            val uid = account.userId ?: ""
            val response = api.createAccount(uid, request)
            response.isSuccessful
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    suspend fun deleteAccount(id: Int, userId: String) = try {
        api.deleteAccount(id, userId).isSuccessful
    } catch (e: Exception) { false }

    // --- TRANSAÇÕES ---
    suspend fun getTransactions(userId: String): List<Transaction> {
        return try {
            api.getTransactions(userId)
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun saveTransaction(t: Transaction): Boolean {
        return try {
            val request = TransactionRequest(
                accountId = t.accountId,
                description = t.description,
                amount = t.amount,
                type = t.type,
                category = t.category,
                date = t.date
            )
            val uid = t.userId ?: ""
            val response = api.createTransaction(uid, request)
            response.isSuccessful
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    suspend fun deleteTransaction(id: Int, userId: String) = try {
        api.deleteTransaction(id, userId).isSuccessful
    } catch (e: Exception) { false }
}