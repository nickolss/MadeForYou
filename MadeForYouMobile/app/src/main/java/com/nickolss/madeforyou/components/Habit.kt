package com.nickolss.madeforyou.components
import com.google.gson.annotations.SerializedName

// Modelo de Leitura (Vem da API)
data class Habit(
    val id: Int? = null,
    val name: String,
    val description: String,
    val color: String? = "#818CF8", // Cor em Hex
    val frequency: String, // "daily", "weekly", "custom"
    val targetDays: Int, // Quantas vezes na semana (ex: 7 para diário)
    val userId: String? = null
)

// Modelo de Escrita (Vai para a API)
data class HabitRequest(
    val name: String,
    val description: String,
    val color: String,
    val frequency: String,
    val targetDays: Int
)