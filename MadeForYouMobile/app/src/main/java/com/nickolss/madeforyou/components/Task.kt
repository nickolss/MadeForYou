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

// NOVA CLASSE: Usada APENAS para enviar para a API (Idêntica ao Swagger)
data class TaskRequest(
    @SerializedName("text") val description: String,
    @SerializedName("completed") val isCompleted: Boolean,
    val priority: String,
    val category: String,
    @SerializedName("dueDate") val dueDate: String
    // Note: NÃO TEM userId aqui, pois ele vai na URL
    // Note: NÃO TEM id, pois é criação
)

data class UserSyncRequest(
    @SerializedName("id") val id: String,
    @SerializedName("email") val email: String,
    @SerializedName("displayName") val displayName: String
)