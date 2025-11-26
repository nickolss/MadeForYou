package com.nickolss.madeforyou.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.AccountTree
import androidx.compose.material.icons.filled.AttachMoney
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material3.Divider
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.NavigationDrawerItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nickolss.madeforyou.data.FinanceRepository
import com.nickolss.madeforyou.data.HabitRepository
import com.nickolss.madeforyou.data.NoteRepository
import com.nickolss.madeforyou.data.ProjectRepository
import com.nickolss.madeforyou.components.SectionCard
import com.nickolss.madeforyou.components.SummaryCard
import com.nickolss.madeforyou.data.TaskRepository
import com.nickolss.madeforyou.ui.theme.CardBackground
import com.nickolss.madeforyou.ui.theme.DarkBackground
import com.nickolss.madeforyou.ui.theme.FinanceGreen
import com.nickolss.madeforyou.ui.theme.InputBorder
import com.nickolss.madeforyou.ui.theme.PrimaryBlue
import com.nickolss.madeforyou.ui.theme.ProgressBarTrack
import com.nickolss.madeforyou.ui.theme.TextGray
import com.nickolss.madeforyou.ui.theme.TextWhite
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    userId: String,
    userName: String,
    onLogout: () -> Unit,
    onNavigateToTasks: () -> Unit,
    onNavigateToProjects: () -> Unit,
    onNavigateToHabits: () -> Unit,
    onNavigateToFinances: () -> Unit,
    onNavigateToNotes: () -> Unit,
    onNavigateToProfile: () -> Unit
) {
    // Estado para controlar o Menu Lateral (Drawer)
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()

    // --- REPOSITÓRIOS PARA BUSCAR DADOS DO BANCO ---
    val taskRepo = remember { TaskRepository() }
    val projectRepo = remember { ProjectRepository() }
    val financeRepo = remember { FinanceRepository() }
    val habitRepo = remember { HabitRepository() }
    val noteRepo = remember { NoteRepository() }

    // --- ESTADOS PARA ARMAZENAR OS RESUMOS ---
    var taskSummary by remember { mutableStateOf("0/0") }
    var taskPercentage by remember { mutableStateOf("0%") }
    var pendingTasksCount by remember { mutableStateOf(0) }

    var projectSummary by remember { mutableStateOf("0") }
    var activeProjectsCount by remember { mutableStateOf(0) }

    var financeBalance by remember { mutableStateOf("R$ 0,00") }

    var habitCount by remember { mutableStateOf(0) }
    var noteCount by remember { mutableStateOf(0) }

    // --- SINCRONIZAÇÃO (Carrega dados ao abrir a tela) ---
    LaunchedEffect(userId) {
        // 1. Carregar Tarefas
        launch {
            val tasks = taskRepo.getTasks(userId) // Note: getTasks do Repo deve retornar List<Task> (ajuste se for diferente no seu repo)
            val total = tasks.size
            val completed = tasks.count { it.isCompleted }
            val pending = total - completed

            taskSummary = "$completed/$total"
            taskPercentage = if (total > 0) "${(completed * 100) / total}% concluídas" else "0% concluídas"
            pendingTasksCount = pending
        }

        // 2. Carregar Projetos
        launch {
            val projects = projectRepo.getProjects(userId)
            val active = projects.count { it.status == "in_progress" || it.status == "Em Progresso" }
            projectSummary = active.toString()
            activeProjectsCount = active
        }

        // 3. Carregar Finanças (Saldo)
        launch {
            val accounts = financeRepo.getAccounts(userId)
            val totalMoney = accounts.sumOf { it.balance }
            financeBalance = "R$ ${String.format("%.2f", totalMoney)}"
        }

        // 4. Carregar Hábitos e Notas (Para estatísticas simples)
        launch {
            habitCount = habitRepo.getHabits(userId).size
        }
        launch {
            noteCount = noteRepo.getNotes(userId).size
        }
    }

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet(drawerContainerColor = CardBackground) {
                Spacer(Modifier.height(16.dp))
                Text("MadeForYou", color = PrimaryBlue, fontSize = 24.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(16.dp))
                Divider(color = InputBorder)

                // --- NAVEGAÇÃO DO MENU LATERAL ---
                NavigationDrawerItem(
                    label = { Text("Início", color = TextWhite) },
                    selected = true,
                    onClick = { scope.launch { drawerState.close() } },
                    icon = { Icon(Icons.Default.Home, null, tint = PrimaryBlue) },
                    modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding)
                )
                NavigationDrawerItem(
                    label = { Text("Minhas Tarefas", color = TextGray) },
                    selected = false,
                    onClick = { scope.launch { drawerState.close() }; onNavigateToTasks() },
                    icon = { Icon(Icons.Default.CheckCircle, null, tint = TextGray) },
                    modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding)
                )
                NavigationDrawerItem(
                    label = { Text("Projetos", color = TextGray) },
                    selected = false,
                    onClick = { scope.launch { drawerState.close() }; onNavigateToProjects() },
                    icon = { Icon(Icons.Default.AccountTree, null, tint = TextGray) },
                    modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding)
                )
                NavigationDrawerItem(
                    label = { Text("Hábitos", color = TextGray) },
                    selected = false,
                    onClick = { scope.launch { drawerState.close() }; onNavigateToHabits() },
                    icon = { Icon(Icons.Default.Psychology, null, tint = TextGray) },
                    modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding)
                )
                NavigationDrawerItem(
                    label = { Text("Notas", color = TextGray) },
                    selected = false,
                    onClick = { scope.launch { drawerState.close() }; onNavigateToNotes() },
                    icon = { Icon(Icons.Default.Description, null, tint = TextGray) },
                    modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding)
                )
                NavigationDrawerItem(
                    label = { Text("Finanças", color = TextGray) },
                    selected = false,
                    onClick = { scope.launch { drawerState.close() }; onNavigateToFinances() },
                    icon = { Icon(Icons.Default.AttachMoney, null, tint = TextGray) },
                    modifier = Modifier.padding(NavigationDrawerItemDefaults.ItemPadding)
                )

                Spacer(Modifier.weight(1f))

                // Logout
                TextButton(onClick = onLogout, modifier = Modifier.padding(16.dp)) {
                    Icon(Icons.AutoMirrored.Filled.ExitToApp, null, tint = Color.Red)
                    Spacer(Modifier.width(8.dp))
                    Text("Sair", color = Color.Red)
                }
            }
        }
    ) {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = { Text("Dashboard", color = TextWhite, fontSize = 18.sp) },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground),
                    navigationIcon = {
                        IconButton(onClick = { scope.launch { drawerState.open() } }) {
                            Icon(Icons.Default.Menu, contentDescription = "Menu", tint = TextWhite)
                        }
                    },
                    actions = {
                        IconButton(onClick = {}) { Icon(Icons.Default.Notifications, null, tint = TextWhite) }
                        IconButton(onClick = {onNavigateToProfile()}) { Icon(Icons.Default.AccountCircle, null, tint = PrimaryBlue) }
                    }
                )
            },
            containerColor = DarkBackground
        ) { paddingValues ->

            Column(
                modifier = Modifier
                    .padding(paddingValues)
                    .fillMaxSize()
                    .padding(16.dp)
                    .verticalScroll(rememberScrollState())
            ) {
                // Saudação (Se o nome do usuário vier do email, pegamos a parte antes do @ na MainActivity ou aqui)
                val displayName = if(userName.contains("@")) userName.split("@")[0] else userName
                Text(
                    text = "Bom dia, $displayName!",
                    color = TextWhite,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Aqui está um resumo do seu dia.",
                    color = TextGray,
                    fontSize = 14.sp
                )

                Spacer(modifier = Modifier.height(24.dp))

                // --- CARROSSEL DE RESUMO (Dados Reais) ---
                // Agora os cards também são clicáveis
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState())
                ) {
                    SummaryCard(
                        title = "Tarefas",
                        value = taskSummary,
                        subtitle = taskPercentage,
                        icon = Icons.Default.CheckCircle,
                        iconColor = PrimaryBlue,
                        modifier = Modifier.clickable { onNavigateToTasks() }
                    )
                    SummaryCard(
                        title = "Projetos",
                        value = projectSummary,
                        subtitle = "em progresso",
                        icon = Icons.Default.AccountTree,
                        iconColor = PrimaryBlue,
                        modifier = Modifier.clickable { onNavigateToProjects() }
                    )
                    SummaryCard(
                        title = "Finanças",
                        value = financeBalance,
                        subtitle = "Saldo total",
                        icon = Icons.Default.AccountBalanceWallet,
                        iconColor = FinanceGreen,
                        modifier = Modifier.clickable { onNavigateToFinances() }
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                // --- SEÇÕES DETALHADAS ---

                // Tarefas Pendentes
                SectionCard(title = "Tarefas Pendentes",
                    linkText = "Ver todas →",
                    onLinkClick = onNavigateToTasks
                ) {
                    Column(modifier = Modifier.clickable { onNavigateToTasks() }) {
                        if (pendingTasksCount > 0) {
                            Text("Você tem $pendingTasksCount tarefas para completar.", color = TextGray, fontSize = 14.sp)
                        } else {
                            Text("Nenhuma tarefa pendente! 🎉", color = TextGray, fontSize = 14.sp, modifier = Modifier.align(Alignment.CenterHorizontally))
                        }
                    }
                }

                // Projetos
                SectionCard(title = "Projetos em Progresso", onLinkClick = onNavigateToProjects) {
                    Column(modifier = Modifier.clickable { onNavigateToProjects() }) {
                        if (activeProjectsCount > 0) {
                            Text("$activeProjectsCount projetos estão em andamento.", color = TextGray, fontSize = 14.sp)
                        } else {
                            Text("Nenhum projeto em progresso.", color = TextGray, fontSize = 14.sp, modifier = Modifier.align(Alignment.CenterHorizontally))
                        }
                    }
                }

                // Hábitos
                SectionCard(title = "Meus Hábitos", onLinkClick = onNavigateToHabits) {
                    Column(modifier = Modifier.clickable { onNavigateToHabits() }) {
                        Text("Você possui $habitCount hábitos cadastrados.", color = TextGray, fontSize = 14.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        LinearProgressIndicator(
                            progress = { 0.0f }, // Lógica de progresso de hábitos é complexa, deixamos 0 por enquanto
                            modifier = Modifier.fillMaxWidth().height(8.dp),
                            color = PrimaryBlue,
                            trackColor = ProgressBarTrack,
                        )
                    }
                }

                // Notas
                SectionCard(title = "Notas Recentes",  onLinkClick = onNavigateToNotes) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth().clickable { onNavigateToNotes() }
                    ) {
                        if (noteCount > 0) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Description, null, tint = TextGray)
                                Spacer(Modifier.width(8.dp))
                                Text("$noteCount notas criadas", color = TextGray, fontSize = 14.sp)
                            }
                        } else {
                            Text("Nenhuma nota ainda", color = TextGray, fontSize = 14.sp)
                        }
                    }
                }
            }
        }
    }
}