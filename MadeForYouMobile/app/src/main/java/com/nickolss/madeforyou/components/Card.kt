package com.nickolss.madeforyou.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nickolss.madeforyou.ui.theme.CardBackground
import com.nickolss.madeforyou.ui.theme.FinanceGreen
import com.nickolss.madeforyou.ui.theme.InputBorder
import com.nickolss.madeforyou.ui.theme.PrimaryBlue
import com.nickolss.madeforyou.ui.theme.PriorityHigh
import com.nickolss.madeforyou.ui.theme.PriorityLow
import com.nickolss.madeforyou.ui.theme.PriorityMedium
import com.nickolss.madeforyou.ui.theme.TextGray
import com.nickolss.madeforyou.ui.theme.TextWhite


@Composable
fun CustomInput(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    isPassword: Boolean = false
) {
    var passwordVisible by remember { mutableStateOf(false) }

    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label, color = TextGray) },
        singleLine = true,
        colors = OutlinedTextFieldDefaults.colors(
            focusedContainerColor = Color.Transparent,
            unfocusedContainerColor = Color.Transparent,
            focusedBorderColor = PrimaryBlue,
            unfocusedBorderColor = InputBorder,
            focusedTextColor = TextWhite,
            unfocusedTextColor = TextWhite,
            cursorColor = PrimaryBlue
        ),
        shape = RoundedCornerShape(8.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        visualTransformation = if (isPassword && !passwordVisible) PasswordVisualTransformation() else VisualTransformation.None,
        trailingIcon = if (isPassword) {
            {
                IconButton(onClick = { passwordVisible = !passwordVisible }) {
                    Icon(
                        imageVector = if (passwordVisible) Icons.Filled.Visibility else Icons.Filled.VisibilityOff,
                        contentDescription = "Toggle Password",
                        tint = TextGray
                    )
                }
            }
        } else null
    )
}

// Botão Principal
@Composable
fun PrimaryButton(text: String, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
        shape = RoundedCornerShape(8.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 16.dp)
            .height(50.dp)
    ) {
        Text(text = text, color = Color.Black, style = MaterialTheme.typography.titleMedium)
    }
}


@Composable
fun SummaryCard(
    title: String,
    value: String,
    subtitle: String,
    icon: ImageVector,
    iconColor: Color,
    modifier: Modifier = Modifier
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(12.dp),
        modifier = modifier
            .width(280.dp) // Largura fixa para permitir rolagem horizontal
            .padding(end = 16.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(imageVector = icon, contentDescription = null, tint = iconColor)
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = value, color = TextWhite, fontWeight = FontWeight.Bold, fontSize = 20.sp)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = subtitle, color = TextGray, fontSize = 12.sp)

            Spacer(modifier = Modifier.height(16.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = title, color = TextWhite, fontWeight = FontWeight.SemiBold)
                Text(text = "Ver detalhes →", color = PrimaryBlue, fontSize = 12.sp)
            }
        }
    }
}

// --- COMPONENTE: Card de Seção (Corpo) ---
@Composable
fun SectionCard(
    title: String,
    linkText: String = "Ver todos →",
    onLinkClick: () -> Unit = {},
    content: @Composable () -> Unit,

) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 16.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = title, color = TextWhite, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Text(text = linkText, color = PrimaryBlue, fontSize = 12.sp, modifier = Modifier
                    .clickable { onLinkClick() } // Adiciona o clique
                    .padding(4.dp))
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Aqui renderizamos o conteúdo específico de cada card
            content()
        }
    }
}

// --- CARD DE ESTATÍSTICA (Topo) ---
@Composable
fun TaskStatCard(
    title: String,
    value: String,
    subtitle: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(8.dp),
        modifier = modifier
            .height(100.dp)
            .padding(4.dp)
    ) {
        Column(
            modifier = Modifier
                .padding(12.dp)
                .fillMaxSize(),
            verticalArrangement = Arrangement.Center
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = value, color = TextWhite, fontWeight = FontWeight.Bold, fontSize = 20.sp)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = title, color = TextGray, fontSize = 12.sp)
            Text(text = subtitle, color = TextGray, fontSize = 10.sp)
        }
    }
}

// --- ITEM DA LISTA DE TAREFAS ---
@Composable
fun TaskItem(
    task: Task,
    onToggleCompletion: (Task) -> Unit,
    onDelete: (Task) -> Unit
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(8.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Checkbox Customizado
            IconButton(onClick = { onToggleCompletion(task) }) {
                Icon(
                    imageVector = if (task.isCompleted) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                    contentDescription = "Completar",
                    tint = if (task.isCompleted) FinanceGreen else TextGray
                )
            }

            Column(modifier = Modifier.weight(1f).padding(horizontal = 8.dp)) {
                Text(
                    text = task.description,
                    color = if (task.isCompleted) TextGray else TextWhite,
                    fontWeight = FontWeight.SemiBold,
                    textDecoration = if (task.isCompleted) androidx.compose.ui.text.style.TextDecoration.LineThrough else null
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Badge de Prioridade
                    Surface(
                        color = when(task.priority) {
                            "Alta" -> PriorityHigh.copy(alpha = 0.2f)
                            "Média" -> PriorityMedium.copy(alpha = 0.2f)
                            else -> PriorityLow.copy(alpha = 0.2f)
                        },
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(
                            text = task.priority,
                            color = when(task.priority) {
                                "Alta" -> PriorityHigh
                                "Média" -> PriorityMedium
                                else -> PriorityLow
                            },
                            fontSize = 10.sp,
                            modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = "${task.category} • ${task.dueDate}", color = TextGray, fontSize = 12.sp)
                }
            }

            IconButton(onClick = { onDelete(task) }) {
                Icon(Icons.Outlined.Delete, contentDescription = "Excluir", tint = Color.Red.copy(alpha = 0.6f))
            }
        }
    }
}