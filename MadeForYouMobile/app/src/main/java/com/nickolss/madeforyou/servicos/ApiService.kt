package com.nickolss.madeforyou.servicos

import com.nickolss.madeforyou.components.Account
import com.nickolss.madeforyou.components.AccountRequest
import com.nickolss.madeforyou.components.Habit
import com.nickolss.madeforyou.components.HabitRequest
import com.nickolss.madeforyou.components.Note
import com.nickolss.madeforyou.components.NoteRequest
import com.nickolss.madeforyou.components.Project
import com.nickolss.madeforyou.components.ProjectRequest
import com.nickolss.madeforyou.components.Task
import com.nickolss.madeforyou.components.TaskRequest
import com.nickolss.madeforyou.components.Transaction
import com.nickolss.madeforyou.components.TransactionRequest
import com.nickolss.madeforyou.components.UserProfile
import com.nickolss.madeforyou.components.UserSyncRequest
import com.nickolss.madeforyou.components.UserUpdateRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    // TAREFAS
    // busca todas as tarefas do user
    @GET("api/tasks")
    suspend fun getTasks(@Query("userId") userId: String): List<Task>

    // cria uma nova tarefa
    @POST("api/tasks")
    suspend fun createTask(
        @Query("userId") userId: String, // ID na URL
        @Body task: TaskRequest          // JSON limpo no corpo
    ): Response<Task>

    // endpoint auxiliar p/ sincronizar os dados do user
    @POST("api/users/sync")
    suspend fun syncUser(@Body user: UserSyncRequest): Response<Any>

    @DELETE("api/tasks/{id}")
    suspend fun deleteTask(@Path("id") id: Int): Response<Unit>

    // atualiza uma tarefa existente
    @PUT("api/tasks/{id}")
    suspend fun updateTask(@Path("id") id: Int, @Body task: Task): Response<Task>

    // deleta uma tarefa
    @DELETE("api/tasks/{id}")
    suspend fun deleteTask(
        @Path("id") id: Int,
        @Query("userId") userId: String
    ): Response<Unit>

    // PROJETOS
    @GET("api/projects")
    suspend fun getProjects(@Query("userId") userId: String): List<Project>

    @POST("api/projects")
    suspend fun createProject(
        @Query("userId") userId: String,
        @Body project: ProjectRequest
    ): Response<Project>

    @DELETE("api/projects/{id}")
    suspend fun deleteProject(
        @Path("id") id: Int,
        @Query("userId") userId: String
    ): Response<Unit>

    // Atualizar Projeto
    @PATCH("api/projects/{id}")
    suspend fun updateProject(
        @Path("id") id: Int,
        @Query("userId") userId: String,
        @Body project: ProjectRequest 
    ): Response<Project>

    // HÁBITOS
    @GET("api/habits")
    suspend fun getHabits(@Query("userId") userId: String): List<Habit>

    @POST("api/habits")
    suspend fun createHabit(
        @Query("userId") userId: String,
        @Body habit: HabitRequest
    ): Response<Habit>

    @PATCH("api/habits/{id}")
    suspend fun updateHabit(
        @Path("id") id: Int,
        @Query("userId") userId: String,
        @Body habit: HabitRequest
    ): Response<Habit>

    @DELETE("api/habits/{id}")
    suspend fun deleteHabit(
        @Path("id") id: Int,
        @Query("userId") userId: String
    ): Response<Unit>

    // FINANÇAS: CONTAS
    @GET("api/finance/accounts")
    suspend fun getAccounts(@Query("userId") userId: String): List<Account>

    @POST("api/finance/accounts")
    suspend fun createAccount(
        @Query("userId") userId: String,
        @Body account: AccountRequest
    ): Response<Account>

    @DELETE("api/finance/accounts/{id}")
    suspend fun deleteAccount(
        @Path("id") id: Int,
        @Query("userId") userId: String
    ): Response<Unit>

    // FINANÇAS: TRANSAÇÕES
    @GET("api/finance/transactions")
    suspend fun getTransactions(@Query("userId") userId: String): List<Transaction>

    @POST("api/finance/transactions")
    suspend fun createTransaction(
        @Query("userId") userId: String,
        @Body transaction: TransactionRequest
    ): Response<Transaction>

    @DELETE("api/finance/transactions/{id}")
    suspend fun deleteTransaction(
        @Path("id") id: Int,
        @Query("userId") userId: String
    ): Response<Unit>

    // NOTAS
    @GET("api/notes")
    suspend fun getNotes(@Query("userId") userId: String): List<Note>

    @POST("api/notes")
    suspend fun createNote(
        @Query("userId") userId: String,
        @Body note: NoteRequest
    ): Response<Note>

    @PATCH("api/notes/{id}")
    suspend fun updateNote(
        @Path("id") id: Int,
        @Query("userId") userId: String,
        @Body note: NoteRequest
    ): Response<Note>

    @DELETE("api/notes/{id}")
    suspend fun deleteNote(
        @Path("id") id: Int,
        @Query("userId") userId: String
    ): Response<Unit>

    // USUÁRIOS
    @GET("api/users/{id}")
    suspend fun getUserProfile(@Path("id") id: String): UserProfile

    @PATCH("api/users/{id}")
    suspend fun updateUserProfile(
        @Path("id") id: String,
        @Body user: UserUpdateRequest
    ): UserProfile

}
