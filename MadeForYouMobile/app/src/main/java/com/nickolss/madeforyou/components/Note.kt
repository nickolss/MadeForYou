package com.nickolss.madeforyou.components

import com.google.gson.annotations.SerializedName

data class Note(
    val id: Int? = null,
    val title: String,
    val content: String,
    val category: String,
    val tags: List<String> = emptyList(), // Lista de Strings
    @SerializedName("isPinned") val isPinned: Boolean, // Mapeamento caso venha diferente
    val color: String? = "#818CF8",
    val createdAt: String? = null,
    val userId: String? = null
)

data class NoteRequest(
    val title: String,
    val content: String,
    val category: String,
    val tags: List<String>,
    val isPinned: Boolean,
    val color: String
)