package com.nickolss.madeforyou.components



import com.google.gson.annotations.SerializedName

// --- CONTAS ---
data class Account(
    val id: Int? = null,
    val name: String,
    val type: String, // Corrente, Poupança, etc
    val balance: Double,
    val bank: String? = null,
    val userId: String? = null
)

data class AccountRequest(
    val name: String,
    val type: String,
    val balance: Double,
    val bank: String
)

// --- TRANSAÇÕES ---
data class Transaction(
    val id: Int? = null,
    val accountId: Int,
    val description: String,
    val amount: Double,
    val type: String, // "expense" (Despesa) ou "income" (Receita)
    val category: String,
    val date: String,
    val userId: String? = null
)

data class TransactionRequest(
    val accountId: Int,
    val description: String,
    val amount: Double,
    val type: String,
    val category: String,
    val date: String
)