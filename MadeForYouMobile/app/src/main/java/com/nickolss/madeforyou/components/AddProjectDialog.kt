package com.nickolss.madeforyou.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.nickolss.madeforyou.ui.theme.CardBackground
import com.nickolss.madeforyou.ui.theme.InputBorder
import com.nickolss.madeforyou.ui.theme.PrimaryBlue
import com.nickolss.madeforyou.ui.theme.TextGray
import com.nickolss.madeforyou.ui.theme.TextWhite

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddProjectDialog(
    projectToEdit: Project? = null,
    onDismiss: () -> Unit,
    // Callback recebe: Nome, Descrição, Prioridade, Status, DataFim
    onConfirm: (String, String, String, String, String) -> Unit
) {
        var name by remember { mutableStateOf(projectToEdit?.name ?: "") }
        var description by remember { mutableStateOf(projectToEdit?.description ?: "") }
        var dueDate by remember { mutableStateOf(projectToEdit?.dueDate ?: "") }

        // Dropdowns
    var status by remember {
        mutableStateOf(when(projectToEdit?.status) {
            "in_progress" -> "Em Progresso"
            "completed" -> "Concluído"
            "paused" -> "Em Pausa"
            else -> "Planejamento"
        })
    }

    var priority by remember {
        mutableStateOf(when(projectToEdit?.priority) {
            "high" -> "Alta"
            "low" -> "Baixa"
            else -> "Média"
        })
    }

        var showPrioMenu by remember { mutableStateOf(false) }
        var showStatusMenu by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            colors = CardDefaults.cardColors(containerColor = CardBackground),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(max = 600.dp) // Limita altura
        ) {
            Column(
                modifier = Modifier
                    .padding(24.dp)
                    .verticalScroll(rememberScrollState()) // Scroll se a tela for pequena
            ) {
                Text(if (projectToEdit == null) "Novo Projeto" else "Editar Projeto", color = TextWhite, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(16.dp))

                CustomInput(value = name, onValueChange = { name = it }, label = "Nome do projeto *")
                CustomInput(value = description, onValueChange = { description = it }, label = "Descrição")

                Spacer(modifier = Modifier.height(8.dp))

                // Dropdown Status
                Box(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                    OutlinedTextField(
                        value = status, onValueChange = {}, label = { Text("Status", color = TextGray) },
                        readOnly = true, trailingIcon = { IconButton(onClick = { showStatusMenu = true }) { Icon(
                            Icons.Default.ArrowDropDown, null, tint = TextGray) } },
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = PrimaryBlue, unfocusedBorderColor = InputBorder),
                        modifier = Modifier.fillMaxWidth()
                    )
                    DropdownMenu(expanded = showStatusMenu, onDismissRequest = { showStatusMenu = false }, modifier = Modifier.background(CardBackground)) {
                        listOf("Planejamento", "Em Progresso", "Em Pausa", "Concluído").forEach { item ->
                            DropdownMenuItem(text = { Text(item, color = TextWhite) }, onClick = { status = item; showStatusMenu = false })
                        }
                    }
                }

                // Dropdown Prioridade
                Box(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                    OutlinedTextField(
                        value = priority, onValueChange = {}, label = { Text("Prioridade", color = TextGray) },
                        readOnly = true, trailingIcon = { IconButton(onClick = { showPrioMenu = true }) { Icon(
                            Icons.Default.ArrowDropDown, null, tint = TextGray) } },
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = PrimaryBlue, unfocusedBorderColor = InputBorder),
                        modifier = Modifier.fillMaxWidth()
                    )
                    DropdownMenu(expanded = showPrioMenu, onDismissRequest = { showPrioMenu = false }, modifier = Modifier.background(CardBackground)) {
                        listOf("Baixa", "Média", "Alta").forEach { item ->
                            DropdownMenuItem(text = { Text(item, color = TextWhite) }, onClick = { priority = item; showPrioMenu = false })
                        }
                    }
                }

                CustomInput(value = dueDate, onValueChange = { dueDate = it }, label = "Data de Conclusão (dd/mm/aaaa)")

                Spacer(modifier = Modifier.height(24.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                    TextButton(onClick = onDismiss) { Text("Cancelar", color = TextGray) }
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = { onConfirm(name, description, priority, status, dueDate) },
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(if (projectToEdit == null) "Criar" else "Salvar")
                    }
                }
            }
        }
    }
}