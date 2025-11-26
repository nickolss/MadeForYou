package com.nickolss.madeforyou.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
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
import com.nickolss.madeforyou.components.AddProjectDialog
import com.nickolss.madeforyou.components.Project
import com.nickolss.madeforyou.components.ProjectItem
import com.nickolss.madeforyou.data.ProjectRepository
import com.nickolss.madeforyou.components.TaskStatCard
import com.nickolss.madeforyou.ui.theme.CardBackground
import com.nickolss.madeforyou.ui.theme.DarkBackground
import com.nickolss.madeforyou.ui.theme.FinanceGreen
import com.nickolss.madeforyou.ui.theme.InputBorder
import com.nickolss.madeforyou.ui.theme.PrimaryBlue
import com.nickolss.madeforyou.ui.theme.TextGray
import com.nickolss.madeforyou.ui.theme.TextWhite
import kotlinx.coroutines.launch
import java.time.LocalDate

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProjectsScreen(userId: String, onBack: () -> Unit) {
    val projectRepository = remember { ProjectRepository() }
    val projects = remember { mutableStateListOf<Project>() }
    val scope = rememberCoroutineScope()
    var projectToEdit by remember { mutableStateOf<Project?>(null) }

    // Carregar Projetos
    fun loadProjects() {
        scope.launch {
            val loaded = projectRepository.getProjects(userId)
            projects.clear()
            projects.addAll(loaded)
        }
    }

    LaunchedEffect(userId) { loadProjects() }

    // Estados UI
    var showDialog by remember { mutableStateOf(false) }
    var filterType by remember { mutableStateOf("Todos") }
    var searchQuery by remember { mutableStateOf("") }

    // Estatísticas
    val total = projects.size
    val inProgress = projects.count { it.status.equals("in_progress", true) || it.status == "Em Progresso" }
    val paused = projects.count { it.status.equals("paused", true) || it.status == "Em Pausa" }
    val completed = projects.count { it.status.equals("completed", true) || it.status == "Concluído" }

    // Filtragem
    val filteredProjects = projects.filter { proj ->
        val matchesSearch = proj.name.contains(searchQuery, ignoreCase = true)
        val matchesFilter = when (filterType) {
            "Planejamento" -> proj.status.contains("planning", true) || proj.status == "Planejamento"
            "Em Progresso" -> proj.status.contains("in_progress", true) || proj.status == "Em Progresso"
            "Em Pausa" -> proj.status.contains("paused", true) || proj.status == "Em Pausa"
            "Concluídos" -> proj.status.contains("completed", true) || proj.status == "Concluído"
            else -> true
        }
        matchesSearch && matchesFilter
    }

    Scaffold(
        containerColor = DarkBackground,
        contentWindowInsets = WindowInsets.safeDrawing,
        modifier = Modifier.padding(top = 32.dp),
        topBar = {
            Row(
                modifier = Modifier.fillMaxWidth().padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, null, tint = TextWhite) }
                    Text("Meus Projetos", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                }
                Button(onClick = { showDialog = true }, colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue), shape = RoundedCornerShape(8.dp)) {
                    Icon(Icons.Default.Add, null, tint = Color.Black)
                    Text("Novo Projeto", color = Color.Black)
                }
            }
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).padding(16.dp)) {

            // Cards de Estatísticas
            Row(modifier = Modifier.fillMaxWidth()) {
                TaskStatCard("Total", "$total", "Total", Icons.Default.Folder, PrimaryBlue, Modifier.weight(1f))
                TaskStatCard("Em Progresso", "$inProgress", "Em Progresso", Icons.Default.PlayArrow, Color(0xFF3B82F6), Modifier.weight(1f))
            }
            Row(modifier = Modifier.fillMaxWidth()) {
                TaskStatCard("Em Pausa", "$paused", "Em Pausa", Icons.Default.Pause, Color(0xFFF59E0B), Modifier.weight(1f))
                TaskStatCard("Concluídos", "$completed", "Concluídos", Icons.Default.CheckCircle, FinanceGreen, Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Filtros
            Row(modifier = Modifier.fillMaxWidth().background(CardBackground, RoundedCornerShape(8.dp)).padding(4.dp)) {
                listOf("Todos", "Planejamento", "Em Progresso", "Em Pausa", "Concluídos").forEach { tab ->
                    val isSelected = filterType == tab
                    Box(
                        modifier = Modifier.weight(1f).height(36.dp).background(if (isSelected) PrimaryBlue else Color.Transparent, RoundedCornerShape(6.dp)).clickable { filterType = tab },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(tab, color = if (isSelected) Color.Black else TextGray, fontSize = 10.sp, fontWeight = FontWeight.Bold, maxLines = 1)
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = searchQuery, onValueChange = { searchQuery = it }, placeholder = { Text("Buscar projetos...", color = TextGray) },
                prefix = { Icon(Icons.Default.Search, null, tint = TextGray) }, modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(focusedContainerColor = CardBackground, unfocusedContainerColor = CardBackground, focusedBorderColor = InputBorder, unfocusedBorderColor = InputBorder, focusedTextColor = TextWhite, unfocusedTextColor = TextWhite),
                shape = RoundedCornerShape(8.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Lista
            LazyColumn {
                items(filteredProjects) { project ->
                    ProjectItem(
                        project = project,
                        userId = userId,
                        onEditClick = { proj ->
                            projectToEdit = proj // Define qual projeto editar
                            showDialog = true    // Abre o modal
                        },
                        onStatusChange = { proj, newStatus ->
                            scope.launch {
                                // MUDANÇA: Injetamos o userId que a tela já conhece
                                val updatedProject = proj.copy(
                                    status = newStatus,
                                    userId = userId // <--- IMPORTANTE!
                                )

                                val success = projectRepository.updateProject(updatedProject)

                                if (success) {
                                    loadProjects()
                                } else {
                                    println("ERRO: Falha ao atualizar status.")
                                }
                            }
                        },
                        onDeleteClick = { proj ->
                            scope.launch {
                                if (proj.id != null) {
                                    val success = projectRepository.deleteProject(proj.id, userId)
                                    if (success) projects.remove(proj)
                                }
                            }
                        }
                    )
                }
            }
        }
    }

    if (showDialog) {
        AddProjectDialog(
            projectToEdit = projectToEdit, // Passa o projeto se for edição
            onDismiss = {
                showDialog = false
                projectToEdit = null // Limpa ao fechar
            },
            onConfirm = { name, desc, prio, status, dateStr ->
                scope.launch {
                    // Conversão de Data
                    val dueDateFormatted = try {
                        if (dateStr.contains("/")) {
                            val parts = dateStr.split("/")
                            "${parts[2]}-${parts[1]}-${parts[0]}"
                        } else dateStr
                    } catch (e: Exception) { LocalDate.now().toString() }

                    val startDateFormatted = LocalDate.now().toString()

                    // Conversão de Status e Prioridade para inglês (aposta segura)
                    val statusApi = when(status) {
                        "Planejamento" -> "planning"
                        "Em Progresso" -> "in_progress"
                        "Em Pausa" -> "paused"
                        "Concluído" -> "completed"
                        else -> "planning"
                    }
                    val priorityApi = when(prio) {
                        "Alta" -> "high"
                        "Média" -> "medium"
                        "Baixa" -> "low"
                        else -> "medium"
                    }



                    val finalProject = Project(
                        id = projectToEdit?.id,
                        userId = userId,
                        name = name,
                        description = desc,
                        progress = if (status == "Concluído") 100 else 0,
                        status = statusApi, // use a var convertida
                        priority = priorityApi, // use a var convertida
                        startDate = LocalDate.now().toString(),
                        dueDate = dueDateFormatted,
                        color = "#818CF8"
                    )

                    val success = if (projectToEdit == null) {
                        projectRepository.saveProject(finalProject) // Criação
                    } else {
                        projectRepository.updateProject(finalProject) // Edição
                    }

                    if (success) {
                        loadProjects()
                        showDialog = false
                        projectToEdit = null
                    }
                }
            }
        )
    }
}