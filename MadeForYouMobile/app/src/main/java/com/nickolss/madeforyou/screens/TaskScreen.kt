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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Pending
import androidx.compose.material.icons.filled.PieChart
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
import com.nickolss.madeforyou.components.AddTaskDialog
import com.nickolss.madeforyou.components.Task
import com.nickolss.madeforyou.components.TaskItem
import com.nickolss.madeforyou.components.TaskStatCard
import com.nickolss.madeforyou.data.TaskRepository
import com.nickolss.madeforyou.ui.theme.CardBackground
import com.nickolss.madeforyou.ui.theme.DarkBackground
import com.nickolss.madeforyou.ui.theme.FinanceGreen
import com.nickolss.madeforyou.ui.theme.InputBorder
import com.nickolss.madeforyou.ui.theme.PrimaryBlue
import com.nickolss.madeforyou.ui.theme.TextGray
import com.nickolss.madeforyou.ui.theme.TextWhite
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TasksScreen(userId: String, onBack: () -> Unit) {
    val taskRepository = remember { TaskRepository() }
    val tasks = remember { mutableStateListOf<Task>() }
    val scope = rememberCoroutineScope()

    // Função para recarregar a lista vinda da API
    fun loadTasks() {
        scope.launch {
            val listaAtualizada = taskRepository.getTasks(userId)
            tasks.clear()
            tasks.addAll(listaAtualizada)
        }
    }

    // Carrega ao iniciar
    LaunchedEffect(userId) {
        loadTasks()
    }

    // ESTADOS: Controle da UI
    var showDialog by remember { mutableStateOf(false) }
    var filterType by remember { mutableStateOf("Todas") } // "Todas", "Pendentes", "Concluídas"
    var searchQuery by remember { mutableStateOf("") }

    // CÁLCULOS: Estatísticas em tempo real
    val totalTasks = tasks.size
    val completedTasks = tasks.count { it.isCompleted }
    val pendingTasks = tasks.count { !it.isCompleted }
    val completionRate = if (totalTasks > 0) (completedTasks * 100 / totalTasks) else 0

    // FILTRAGEM
    val filteredTasks = tasks.filter { task ->
        val matchesSearch = task.description.contains(searchQuery, ignoreCase = true)
        val matchesFilter = when (filterType) {
            "Pendentes" -> !task.isCompleted
            "Concluídas" -> task.isCompleted
            else -> true
        }
        matchesSearch && matchesFilter
    }

    Scaffold(
        containerColor = DarkBackground,
        contentWindowInsets = WindowInsets.safeDrawing,
        modifier = Modifier.padding(
            top = 32.dp,

        ),
        topBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, null, tint = TextWhite) }
                    Text("Minhas Tarefas", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                }
                Button(
                    onClick = { showDialog = true },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(Icons.Default.Add, null, tint = Color.Black)
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Nova Tarefa", color = Color.Black)
                }
            }
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).padding(16.dp)) {

            // CARDS DE ESTATÍSTICA
            Row(modifier = Modifier.fillMaxWidth()) {
                TaskStatCard("Total", "$totalTasks", "Total", Icons.Default.BarChart, PrimaryBlue, Modifier.weight(1f))
                TaskStatCard("Concluídas", "$completedTasks", "Concluídas", Icons.Default.CheckCircle, FinanceGreen, Modifier.weight(1f))
            }
            Row(modifier = Modifier.fillMaxWidth()) {
                TaskStatCard("Pendentes", "$pendingTasks", "Pendentes", Icons.Default.Pending, Color(0xFFF59E0B), Modifier.weight(1f))
                TaskStatCard("Taxa", "$completionRate%", "Taxa de Conclusão", Icons.Default.PieChart, PrimaryBlue, Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(24.dp))

            // FILTROS E BUSCA
            Column {
                Row(modifier = Modifier.fillMaxWidth().background(CardBackground, RoundedCornerShape(8.dp)).padding(4.dp)) {
                    listOf("Todas", "Pendentes", "Concluídas").forEach { tab ->
                        val isSelected = filterType == tab
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(36.dp)
                                .background(if (isSelected) PrimaryBlue else Color.Transparent, RoundedCornerShape(6.dp))
                                .clickable { filterType = tab },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(tab, color = if (isSelected) Color.Black else TextGray, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Buscar tarefas...", color = TextGray) },
                    prefix = { Icon(Icons.Default.Search, null, tint = TextGray) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = CardBackground, unfocusedContainerColor = CardBackground,
                        focusedBorderColor = InputBorder, unfocusedBorderColor = InputBorder,
                        focusedTextColor = TextWhite, unfocusedTextColor = TextWhite
                    ),
                    shape = RoundedCornerShape(8.dp)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))
            Text("Tarefas", color = TextWhite, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))

            // LISTA DE TAREFAS
            LazyColumn {
                items(filteredTasks) { task ->
                    TaskItem(
                        task = task,
                        onToggleCompletion = { t ->
                            scope.launch {
                                // Encontra o índice na lista ORIGINAL para atualizar o estado
                                val index = tasks.indexOf(t)
                                if (index != -1) {
                                    val updatedTask = t.copy(isCompleted = !t.isCompleted)

                                    // Atualiza a lista principal 
                                    tasks[index] = updatedTask

                                    // Chama a API
                                    taskRepository.saveTask(updatedTask)
                                }
                            }
                        },
                        onDelete = { t ->
                            scope.launch {
                                if (t.id != null) {
                                    val sucesso = taskRepository.deleteTask(t.id, userId)
                                    if (sucesso) {
                                        // Remove da lista original
                                        tasks.remove(t)
                                    }
                                }
                            }
                        }
                    )
                }

                // Mensagem de lista vazia
                if (filteredTasks.isEmpty()) {
                    item {
                        Box(modifier = Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
                            Text(
                                text = if (searchQuery.isNotEmpty()) "Nenhuma tarefa encontrada na busca."
                                else if (filterType == "Pendentes") "Nenhuma tarefa pendente!"
                                else "Nenhuma tarefa aqui.",
                                color = TextGray
                            )
                        }
                    }
                }
            }
        }
    }

    // EXIBIÇÃO DO MODAL
    if (showDialog) {
        AddTaskDialog(
            onDismiss = { showDialog = false },
            onConfirm = { desc, prio, cat, dateStr ->
                scope.launch {
                    // convercao da data (de dd/mm/aaaa para aaaa-mm-dd)
                    val dateFormatted = try {
                        if (dateStr.contains("/")) {
                            val parts = dateStr.split("/")
                            "${parts[2]}-${parts[1]}-${parts[0]}"
                        } else dateStr
                    } catch (e: Exception) {
                        // Se falhar, usa data de hoje para não quebrar a API
                        java.time.LocalDate.now().toString()
                    }

                    // convercao da prioridade (Português -> Inglês minúsculo)
                    // O backend espera: "low", "medium", "high"
                    val priorityApi = when (prio) {
                        "Alta" -> "high"
                        "Média", "Media" -> "medium"
                        "Baixa" -> "low"
                        else -> "medium"
                    }

                    println("DEBUG: Enviando Data: $dateFormatted e Prioridade: $priorityApi")

                    // CRIAR O OBJETO
                    val newTask = Task(
                        id = null,
                        userId = userId, // Vai para a URL
                        description = desc, // Vai para o corpo como "text"
                        priority = priorityApi, // "medium"
                        category = cat,
                        dueDate = dateFormatted,
                        isCompleted = false
                    )

                    // CHAMAR A API
                    val sucesso = taskRepository.saveTask(newTask)

                    if (sucesso) {
                        println("SUCESSO: Tarefa criada!")
                        loadTasks() // Recarrega a lista
                        showDialog = false // Fecha o modal
                    } else {
                        println("ERRO: O servidor recusou a tarefa. Veja o log acima.")
                    }
                }
            }
        )
    }




}
