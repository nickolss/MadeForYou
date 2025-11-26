package com.nickolss.madeforyou.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
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
fun AddNoteDialog(
    noteToEdit: Note? = null,
    onDismiss: () -> Unit,
    // Callback: Title, Content, Category, Tags(String), IsPinned, Color
    onConfirm: (String, String, String, String, Boolean, String) -> Unit
) {
    var title by remember { mutableStateOf(noteToEdit?.title ?: "") }
    var content by remember { mutableStateOf(noteToEdit?.content ?: "") }
    var category by remember { mutableStateOf(noteToEdit?.category ?: "") }

    // Converte lista de tags para string separada por vírgula para edição
    var tagsStr by remember { mutableStateOf(noteToEdit?.tags?.joinToString(", ") ?: "") }

    var isPinned by remember { mutableStateOf(noteToEdit?.isPinned ?: false) }
    var selectedColor by remember { mutableStateOf(noteToEdit?.color ?: "#818CF8") }

    val colorPalette = listOf("#818CF8", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#8B5CF6")

    Dialog(onDismissRequest = onDismiss) {
        Card(colors = CardDefaults.cardColors(containerColor = CardBackground), shape = RoundedCornerShape(16.dp)) {
            Column(modifier = Modifier.padding(24.dp)) {
                Text(if (noteToEdit == null) "Nova Nota" else "Editar Nota", color = TextWhite, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(16.dp))

                CustomInput(value = title, onValueChange = { title = it }, label = "Título *")

                // Conteúdo (Input maior)
                OutlinedTextField(
                    value = content, onValueChange = { content = it }, label = { Text("Conteúdo *", color = TextGray) },
                    colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = PrimaryBlue, unfocusedBorderColor = InputBorder),
                    modifier = Modifier.fillMaxWidth().height(120.dp).padding(vertical = 6.dp),
                    maxLines = 5
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Box(Modifier.weight(1f)) { CustomInput(value = category, onValueChange = { category = it }, label = "Categoria") }
                    Box(Modifier.weight(1f)) { CustomInput(value = tagsStr, onValueChange = { tagsStr = it }, label = "Tags (separadas por vírgula)") }
                }

                Spacer(Modifier.height(8.dp))

                // Seletor de Cor + Checkbox Fixar
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                    Column {
                        Text("Cor", color = TextGray, fontSize = 12.sp)
                        Spacer(Modifier.height(4.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            colorPalette.take(4).forEach { colorHex -> // Mostra só 4 pra caber
                                val color = Color(android.graphics.Color.parseColor(colorHex))
                                Box(modifier = Modifier.size(24.dp).clip(CircleShape).background(color)
                                    .border(if(selectedColor == colorHex) 2.dp else 0.dp, TextWhite, CircleShape)
                                    .clickable { selectedColor = colorHex })
                            }
                        }
                    }

                    Button(
                        onClick = { isPinned = !isPinned },
                        colors = ButtonDefaults.buttonColors(containerColor = if(isPinned) PrimaryBlue else InputBorder),
                        contentPadding = PaddingValues(horizontal = 12.dp)
                    ) {
                        Text(if(isPinned) "Fixado" else "Fixar", color = TextWhite, fontSize = 12.sp)
                    }
                }

                Spacer(Modifier.height(24.dp))
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                    TextButton(onClick = onDismiss) { Text("Cancelar", color = TextGray) }
                    Spacer(Modifier.width(8.dp))
                    Button(
                        onClick = { onConfirm(title, content, category, tagsStr, isPinned, selectedColor) },
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                        shape = RoundedCornerShape(8.dp)
                    ) { Text(if(noteToEdit == null) "Criar" else "Salvar", color = Color.Black) }
                }
            }
        }
    }
}