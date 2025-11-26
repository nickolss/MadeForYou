package com.nickolss.madeforyou.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
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
fun AddHabitDialog(
    habitToEdit: Habit? = null,
    onDismiss: () -> Unit,
    onConfirm: (String, String, String, Int, String) -> Unit // Name, Desc, Freq, TargetDays, Color
) {
    var name by remember { mutableStateOf(habitToEdit?.name ?: "") }
    var description by remember { mutableStateOf(habitToEdit?.description ?: "") }

    // Lógica de Frequência
    // Traduzindo API -> Visual
    var frequencyLabel by remember {
        mutableStateOf(when(habitToEdit?.frequency) {
            "daily" -> "Diário"
            "weekly" -> "Semanal"
            else -> "Personalizado"
        })
    }
    var targetDays by remember { mutableStateOf(habitToEdit?.targetDays?.toString() ?: "7") }

    // Cor selecionada (Hex)
    var selectedColorHex by remember { mutableStateOf(habitToEdit?.color ?: "#818CF8") }

    var showFreqMenu by remember { mutableStateOf(false) }

    // Lista de cores pré-definidas para o usuário escolher
    val colorPalette = listOf("#818CF8", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#8B5CF6")

    Dialog(onDismissRequest = onDismiss) {
        Card(
            colors = CardDefaults.cardColors(containerColor = CardBackground),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(24.dp)) {
                Text(if (habitToEdit == null) "Novo Hábito" else "Editar Hábito", color = TextWhite, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(16.dp))

                CustomInput(value = name, onValueChange = { name = it }, label = "Nome do hábito *")
                CustomInput(value = description, onValueChange = { description = it }, label = "Descrição")

                // Dropdown Frequência
                Box(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                    OutlinedTextField(
                        value = frequencyLabel, onValueChange = {}, label = { Text("Frequência", color = TextGray) },
                        readOnly = true, trailingIcon = { IconButton(onClick = { showFreqMenu = true }) { Icon(
                            Icons.Default.ArrowDropDown, null, tint = TextGray) } },
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = PrimaryBlue, unfocusedBorderColor = InputBorder),
                        modifier = Modifier.fillMaxWidth()
                    )
                    DropdownMenu(expanded = showFreqMenu, onDismissRequest = { showFreqMenu = false }, modifier = Modifier.background(CardBackground)) {
                        listOf("Diário", "Semanal", "Personalizado").forEach { item ->
                            DropdownMenuItem(text = { Text(item, color = TextWhite) }, onClick = {
                                frequencyLabel = item
                                if (item == "Diário") targetDays = "7"
                                if (item == "Semanal") targetDays = "1"
                                showFreqMenu = false
                            })
                        }
                    }
                }

                // Se for personalizado, mostra input de dias
                if (frequencyLabel == "Personalizado") {
                    OutlinedTextField(
                        value = targetDays,
                        onValueChange = { if (it.all { char -> char.isDigit() }) targetDays = it },
                        label = { Text("Vezes por semana", color = TextGray) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = PrimaryBlue, unfocusedBorderColor = InputBorder),
                        modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))
                Text("Cor", color = TextGray, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(8.dp))

                // Seletor de Cores (Bolinhas)
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    colorPalette.forEach { colorHex ->
                        val color = Color(android.graphics.Color.parseColor(colorHex))
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(color)
                                .border(
                                    width = if (selectedColorHex == colorHex) 2.dp else 0.dp,
                                    color = TextWhite,
                                    shape = CircleShape
                                )
                                .clickable { selectedColorHex = colorHex }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                    TextButton(onClick = onDismiss) { Text("Cancelar", color = TextGray) }
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = {
                            // Traduz visual -> API
                            val apiFreq = when(frequencyLabel) {
                                "Diário" -> "daily"
                                "Semanal" -> "weekly"
                                else -> "custom"
                            }
                            onConfirm(name, description, apiFreq, targetDays.toIntOrNull() ?: 1, selectedColorHex)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(if (habitToEdit == null) "Criar" else "Salvar", color = Color.Black)
                    }
                }
            }
        }
    }
}