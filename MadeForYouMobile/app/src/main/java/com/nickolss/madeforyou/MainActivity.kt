package com.nickolss.madeforyou

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.nickolss.madeforyou.data.AuthRepository
import com.nickolss.madeforyou.screens.FinanceScreen
import com.nickolss.madeforyou.screens.HabitsScreen
import com.nickolss.madeforyou.screens.HomeScreen
import com.nickolss.madeforyou.screens.LoginScreen
import com.nickolss.madeforyou.screens.NotesScreen
import com.nickolss.madeforyou.screens.ProfileScreen
import com.nickolss.madeforyou.screens.ProjectsScreen
import com.nickolss.madeforyou.screens.RegisterScreen
import com.nickolss.madeforyou.screens.TasksScreen
import com.nickolss.madeforyou.ui.theme.MadeForYouTheme

class MainActivity : ComponentActivity() {

    private val authRepository = AuthRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        setContent {
            MadeForYouTheme {
                // Define a tela inicial
                var currentScreen by remember {
                    mutableStateOf(if (authRepository.currentUser != null) "home" else "login")
                }

                when (currentScreen) {
                    "login" -> LoginScreen(
                        authRepository = authRepository, // instancia do repository p/ o login
                        onLoginSuccess = {
                            currentScreen = "home"
                        },
                        onNavigateToRegister = {
                            currentScreen = "register"
                        }
                    )

                    "register" -> RegisterScreen(
                        authRepository = authRepository, // instancia do Authrepository p/ o registro
                        onRegisterSuccess = {
                            currentScreen = "home"
                        },
                        onNavigateToLogin = {
                            currentScreen = "login"
                        }
                    )

                    // TAREFAS
                    "tasks" -> {
                        val userId = authRepository.currentUser?.uid ?: ""
                        if (userId.isNotEmpty()) {
                            TasksScreen(
                                userId = userId,
                                onBack = { currentScreen = "home" }
                            )
                        } else {
                            // Se der erro e não tiver user, volta pro login
                            currentScreen = "login"
                        }
                    }

                    // TELA PRINCIPAL DASHBOARD
                    "home" -> HomeScreen(
                        // Passa o ID para carregar os dados
                        userId = authRepository.currentUser?.uid ?: "",

                        // Passa o Nome/Email para a saudação
                        userName = authRepository.currentUser?.email ?: "Usuário",

                        onLogout = {
                            authRepository.logout()
                            currentScreen = "login"
                        },
                        onNavigateToTasks = {
                            currentScreen = "tasks"
                        },
                        onNavigateToProjects = {
                            currentScreen = "projects"
                        },
                        onNavigateToHabits = {
                            currentScreen = "habits"
                        },
                        onNavigateToFinances = {
                            currentScreen = "finances"
                        },
                        onNavigateToNotes = {
                            currentScreen = "notes"
                        },
                        onNavigateToProfile = {
                            currentScreen = "profile"
                        }
                    )
                    "projects" -> ProjectsScreen(
                        userId = authRepository.currentUser?.uid ?: "",
                        onBack = { currentScreen = "home" }
                    )
                    "habits" -> HabitsScreen(
                        userId = authRepository.currentUser?.uid ?: "",
                        onBack = { currentScreen = "home" }
                    )
                    "finances" -> FinanceScreen(
                        userId = authRepository.currentUser?.uid ?: "",
                        onBack = { currentScreen = "home" }
                    )
                    "notes" -> NotesScreen(
                        userId = authRepository.currentUser?.uid ?: "",
                        onBack = { currentScreen = "home" }
                    )
                    "profile" -> ProfileScreen(
                        userId = authRepository.currentUser?.uid ?: "",
                        onBack = { currentScreen = "home" },
                        onLogout = {
                            authRepository.logout()
                            currentScreen = "login"
                        }
                    )
                }
            }
        }
    }
}
