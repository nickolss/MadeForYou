package com.nickolss.madeforyou.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.PieChart
import androidx.compose.material.icons.filled.Timeline
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nickolss.madeforyou.components.AddHabitDialog
import com.nickolss.madeforyou.components.Habit
import com.nickolss.madeforyou.data.HabitRepository
import com.nickolss.madeforyou.components.TaskStatCard
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
fun HabitsScreen(userId: String, onBack: () -> Unit) {
    val habitRepository = remember { HabitRepository() }
    val habits = remember { mutableStateListOf<Habit>() }
    val scope = rememberCoroutineScope()

    // Carregar
    fun loadHabits() {
        scope.launch {
            val loaded = habitRepository.getHabits(userId)
            habits.clear()
            habits.addAll(loaded)
        }
    }

    LaunchedEffect(userId) { loadHabits() }

    var showDialog by remember { mutableStateOf(false) }
    var habitToEdit by remember { mutableStateOf<Habit?>(null) }

    // Estatísticas
    val totalHabits = habits.size
    val activeHabits = habits.size // Assumindo todos ativos
    val currentStreak = 0
    val completionRate = 0

    Scaffold(
        containerColor = DarkBackground,
        modifier = Modifier.padding(top = 32.dp),
        topBar = {
            Row(
                modifier = Modifier.fillMaxWidth().padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, null, tint = TextWhite) }
                    Text("Meus Hábitos", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                }
                Button(onClick = { showDialog = true }, colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue), shape = RoundedCornerShape(8.dp)) {
                    Icon(Icons.Default.Add, null, tint = Color.Black)
                    Text("Novo Hábito", color = Color.Black)
                }
            }
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).padding(16.dp)) {

            // Cards de Estatísticas
            Row(modifier = Modifier.fillMaxWidth()) {
                TaskStatCard("Total", "$totalHabits", "Total de Hábitos", Icons.Default.CheckCircle, PrimaryBlue, Modifier.weight(1f))
                TaskStatCard("Ativos", "$activeHabits", "Hábitos Ativos", Icons.Default.Timeline, Color(0xFF3B82F6), Modifier.weight(1f))
            }
            Row(modifier = Modifier.fillMaxWidth()) {
                TaskStatCard("Sequência", "$currentStreak", "Sequência Atual", Icons.Default.LocalFireDepartment, Color(0xFFF59E0B), Modifier.weight(1f))
                TaskStatCard("Taxa", "$completionRate%", "Taxa de Conclusão", Icons.Default.PieChart, FinanceGreen, Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Título
            Text("Meus Hábitos ($totalHabits)", color = TextWhite, fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Spacer(modifier = Modifier.height(16.dp))

            // LISTA
            LazyColumn {
                items(habits) { habit ->
                    HabitItem(
                        habit = habit,
                        onEdit = {
                            habitToEdit = habit.copy(userId = userId) // Injeta UserID para edição
                            showDialog = true
                        },
                        onDelete = {
                            scope.launch {
                                if (habit.id != null) {
                                    val success = habitRepository.deleteHabit(habit.id, userId)
                                    if (success) habits.remove(habit)
                                }
                            }
                        }
                    )
                }
                if (habits.isEmpty()) {
                    item {
                        Box(modifier = Modifier.fillMaxWidth().padding(40.dp), contentAlignment = Alignment.Center) {
                            Text("Nenhum hábito cadastrado.", color = TextGray)
                        }
                    }
                }
            }
        }
    }

    // Modal de Criação/Edição
    if (showDialog) {
        AddHabitDialog(
            habitToEdit = habitToEdit,
            onDismiss = {
                showDialog = false
                habitToEdit = null
            },
            onConfirm = { name, desc, freq, targetDays, color ->
                scope.launch {
                    val newHabit = Habit(
                        id = habitToEdit?.id,
                        userId = userId,
                        name = name,
                        description = desc,
                        frequency = freq,
                        targetDays = targetDays,
                        color = color
                    )

                    val success = habitRepository.saveHabit(newHabit)
                    if (success) {
                        loadHabits()
                        showDialog = false
                        habitToEdit = null
                    }
                }
            }
        )
    }
}

// Componente Visual do Card de Hábito com Menu
@Composable
fun HabitItem(habit: Habit, onEdit: () -> Unit, onDelete: () -> Unit) {
    var showMenu by remember { mutableStateOf(false) }
    val habitColor = try { Color(android.graphics.Color.parseColor(habit.color)) } catch (e: Exception) { PrimaryBlue }

    Card(
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(8.dp),
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(habit.name, color = TextWhite, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    // Bolinha da cor do hábito
                    Box(modifier = Modifier.size(12.dp).clip(CircleShape).background(habitColor))
                }

                // Menu 3 Pontos
                Box {
                    IconButton(onClick = { showMenu = true }) {
                        Icon(Icons.Default.MoreVert, null, tint = TextGray)
                    }
                    DropdownMenu(expanded = showMenu, onDismissRequest = { showMenu = false }, modifier = Modifier.background(CardBackground)) {
                        DropdownMenuItem(
                            text = { Text("Editar", color = TextWhite) },
                            leadingIcon = { Icon(Icons.Default.Edit, null, tint = PrimaryBlue) },
                            onClick = { showMenu = false; onEdit() }
                        )
                        Divider(color = InputBorder)
                        DropdownMenuItem(
                            text = { Text("Excluir", color = Color.Red) },
                            leadingIcon = { Icon(Icons.Default.Delete, null, tint = Color.Red) },
                            onClick = { showMenu = false; onDelete() }
                        )
                    }
                }
            }

            Text(habit.description, color = TextGray, fontSize = 12.sp)
            Spacer(modifier = Modifier.height(8.dp))

            // Tag de Frequência
            Surface(color = habitColor.copy(alpha = 0.15f), shape = RoundedCornerShape(16.dp)) {
                Text(
                    text = "${habit.targetDays}x por semana",
                    color = habitColor,
                    fontSize = 12.sp,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }

            // Barra de progresso
            Spacer(modifier = Modifier.height(8.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("Últimos 30 dias: 0/0", color = TextGray, fontSize = 10.sp)
                Text("0%", color = TextGray, fontSize = 10.sp)
            }
            LinearProgressIndicator(
                progress = { 0f }, // Placeholder
                modifier = Modifier.fillMaxWidth().height(6.dp),
                color = habitColor,
                trackColor = Color.DarkGray
            )
        }
    }
}
