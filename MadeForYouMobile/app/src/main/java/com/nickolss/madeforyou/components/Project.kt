package com.nickolss.madeforyou.components

// Modelo para receber dados (Leitura)
data class Project(
    val id: Int? = null,
    val name: String,
    val description: String,
    val progress: Int, // 0 a 100
    val status: String, // "Planejamento", "Em Progresso", etc
    val priority: String,
    val startDate: String,
    val dueDate: String,
    val color: String? = null,// Cor padrão
    val userId: String? = null // Uso interno
)

// Modelo para ENVIAR dados (Escrita - JSON Limpo)
data class ProjectRequest(
    val name: String,
    val description: String,
    val progress: Int,
    val status: String,
    val priority: String,
    val startDate: String,
    val dueDate: String,
    val color: String
)