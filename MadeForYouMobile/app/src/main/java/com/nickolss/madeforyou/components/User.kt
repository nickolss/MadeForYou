package com.nickolss.madeforyou.components


import com.google.gson.annotations.SerializedName

// Modelo de Leitura (GET)
data class UserProfile(
    val id: String,
    val email: String,
    val displayName: String?,
    val firstName: String?,
    val lastName: String?,
    val avatarUrl: String?
)

// Modelo de Atualização (PATCH)
data class UserUpdateRequest(
    val firstName: String?,
    val lastName: String?,
    val displayName: String?,
    val avatarUrl: String?
)