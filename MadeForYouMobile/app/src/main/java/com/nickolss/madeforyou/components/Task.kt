package com.nickolss.madeforyou.components
import com.google.gson.annotations.SerializedName

data class Task(
    val id: Int? = null,
    @SerializedName("text") val description: String,
    @SerializedName("completed") val isCompleted: Boolean = false,
    val priority: String,
    val category: String,
    @SerializedName("dueDate") val dueDate: String,
    val userId: String? = null // Usado apenas internamente no app
)

// usada so p/ enviar p/ a API
data class TaskRequest(
    @SerializedName("text") val description: String,
    @SerializedName("completed") val isCompleted: Boolean,
    val priority: String,
    val category: String,
    @SerializedName("dueDate") val dueDate: String
)

data class UserSyncRequest(
    @SerializedName("id") val id: String,
    @SerializedName("email") val email: String,
    @SerializedName("displayName") val displayName: String
)
