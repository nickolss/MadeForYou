package com.nickolss.madeforyou.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nickolss.madeforyou.ui.theme.CardBackground
import com.nickolss.madeforyou.ui.theme.InputBorder
import com.nickolss.madeforyou.ui.theme.PrimaryBlue
import com.nickolss.madeforyou.ui.theme.TextGray
import com.nickolss.madeforyou.ui.theme.TextWhite

@Composable
fun ProjectItem(
    project: Project,
    userId: String,
    onEditClick: (Project) -> Unit,
    onStatusChange: (Project, String) -> Unit, // Novo status (in_progress, completed)
    onDeleteClick: (Project) -> Unit
) {
    var showMenu by remember { mutableStateOf(false) }

    Card(
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(8.dp),
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {

            // Cabeçalho: Título e Menu 3 Pontos
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(project.name, color = TextWhite, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Text(project.description, color = TextGray, fontSize = 12.sp, maxLines = 2)
                }

                // --- MENU DE TRÊS PONTOS ---
                Box {
                    IconButton(onClick = { showMenu = true }) {
                        Icon(Icons.Default.MoreVert, contentDescription = "Opções", tint = TextGray)
                    }

                    DropdownMenu(
                        expanded = showMenu,
                        onDismissRequest = { showMenu = false },
                        modifier = Modifier.background(CardBackground)
                    ) {
                        // 1. EDITAR
                        DropdownMenuItem(
                            text = { Text("Editar", color = TextWhite) },
                            leadingIcon = { Icon(Icons.Default.Edit, null, tint = PrimaryBlue) },
                            onClick = { showMenu = false; onEditClick(project) }
                        )
                        // 2. INICIAR (Só mostra se não estiver em progresso ou concluído)
                        if (project.status == "planning" || project.status == "paused") {
                            DropdownMenuItem(
                                text = { Text("Iniciar", color = TextWhite) },
                                leadingIcon = { Icon(Icons.Default.PlayArrow, null, tint = Color(0xFF10B981)) }, // Verde
                                onClick = { showMenu = false; onStatusChange(project, "in_progress") }
                            )
                        }
                        // 3. CONCLUIR
                        if (project.status != "completed") {
                            DropdownMenuItem(
                                text = { Text("Concluir", color = TextWhite) },
                                leadingIcon = { Icon(Icons.Default.CheckCircle, null, tint = PrimaryBlue) },
                                onClick = { showMenu = false; onStatusChange(project, "completed") }
                            )
                        }
                        // 4. EXCLUIR
                        Divider(color = InputBorder)
                        DropdownMenuItem(
                            text = { Text("Excluir", color = Color.Red) },
                            leadingIcon = { Icon(Icons.Default.Delete, null, tint = Color.Red) },
                            onClick = { showMenu = false; onDeleteClick(project) }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Tags (Status e Prioridade)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                // Badge Status
                Surface(color = PrimaryBlue.copy(alpha = 0.1f), shape = RoundedCornerShape(16.dp)) {
                    Text(
                        text = when(project.status) {
                            "planning" -> "Planejamento"
                            "in_progress" -> "Em Progresso"
                            "completed" -> "Concluído"
                            "paused" -> "Em Pausa"
                            else -> project.status
                        },
                        color = PrimaryBlue,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
                // Badge Prioridade
                Surface(color = Color(0xFFF59E0B).copy(alpha = 0.1f), shape = RoundedCornerShape(16.dp)) {
                    Text(
                        text = when(project.priority) {
                            "high" -> "Alta"
                            "medium" -> "Média"
                            "low" -> "Baixa"
                            else -> project.priority
                        },
                        color = Color(0xFFF59E0B),
                        fontSize = 12.sp,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text("Prazo: ${project.dueDate}", color = TextGray, fontSize = 12.sp)

            Spacer(modifier = Modifier.height(8.dp))

            // Barra de Progresso
            Text("Progresso", color = TextGray, fontSize = 12.sp)
            Spacer(modifier = Modifier.height(4.dp))
            LinearProgressIndicator(
                progress = {
                    if (project.status == "completed") 1f
                    else if (project.status == "in_progress") 0.5f
                    else 0f
                },
                modifier = Modifier.fillMaxWidth().height(6.dp),
                color = PrimaryBlue,
                trackColor = Color.DarkGray,
                strokeCap = androidx.compose.ui.graphics.StrokeCap.Round
            )
        }
    }
}