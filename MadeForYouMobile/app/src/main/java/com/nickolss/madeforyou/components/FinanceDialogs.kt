package com.nickolss.madeforyou.components



import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.nickolss.madeforyou.ui.theme.*
import java.time.LocalDate

// --- MODAL DE NOVA CONTA ---
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddAccountDialog(
    onDismiss: () -> Unit,
    onConfirm: (String, String, Double, String) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var bank by remember { mutableStateOf("") }
    var balanceStr by remember { mutableStateOf("") }
    var type by remember { mutableStateOf("Corrente") }
    var showMenu by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Card(colors = CardDefaults.cardColors(containerColor = CardBackground), shape = RoundedCornerShape(16.dp)) {
            Column(modifier = Modifier.padding(24.dp)) {
                Text("Nova Conta", color = TextWhite, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(16.dp))

                CustomInput(value = name, onValueChange = { name = it }, label = "Nome da Conta *")

                // Dropdown Tipo
                Box(Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                    OutlinedTextField(
                        value = type, onValueChange = {}, label = { Text("Tipo", color = TextGray) }, readOnly = true,
                        trailingIcon = { IconButton(onClick = { showMenu = true }) { Icon(Icons.Default.ArrowDropDown, null, tint = TextGray) } },
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = PrimaryBlue, unfocusedBorderColor = InputBorder),
                        modifier = Modifier.fillMaxWidth()
                    )
                    DropdownMenu(expanded = showMenu, onDismissRequest = { showMenu = false }, modifier = Modifier.background(CardBackground)) {
                        listOf("Corrente", "Poupança", "Cartão de Crédito", "Investimento", "Outro").forEach { item ->
                            DropdownMenuItem(text = { Text(item, color = TextWhite) }, onClick = { type = item; showMenu = false })
                        }
                    }
                }

                OutlinedTextField(
                    value = balanceStr, onValueChange = { if (it.all { c -> c.isDigit() || c == '.' }) balanceStr = it },
                    label = { Text("Saldo Inicial (R$) *", color = TextGray) },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = PrimaryBlue, unfocusedBorderColor = InputBorder),
                    modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)
                )

                CustomInput(value = bank, onValueChange = { bank = it }, label = "Nome do Banco (Opcional)")

                Spacer(Modifier.height(24.dp))
                Button(
                    onClick = { onConfirm(name, type, balanceStr.toDoubleOrNull() ?: 0.0, bank) },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Criar Conta", color = Color.Black) }
            }
        }
    }
}

// --- MODAL DE NOVA TRANSAÇÃO ---
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddTransactionDialog(
    accounts: List<Account>, // Recebe a lista de contas existentes
    onDismiss: () -> Unit,
    onConfirm: (String, Double, String, Int, String, String) -> Unit // Desc, Valor, Tipo, AccountId, Category, Date
) {
    var description by remember { mutableStateOf("") }
    var amountStr by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("") }
    var date by remember { mutableStateOf(LocalDate.now().toString()) }

    // Dropdowns
    var type by remember { mutableStateOf("Despesa") }
    var selectedAccount by remember { mutableStateOf(accounts.firstOrNull()) }

    var showTypeMenu by remember { mutableStateOf(false) }
    var showAccountMenu by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Card(colors = CardDefaults.cardColors(containerColor = CardBackground), shape = RoundedCornerShape(16.dp)) {
            Column(modifier = Modifier.padding(24.dp)) {
                Text("Nova Transação", color = TextWhite, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(16.dp))

                CustomInput(value = description, onValueChange = { description = it }, label = "Descrição *")

                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    // Valor
                    OutlinedTextField(
                        value = amountStr, onValueChange = { if (it.all { c -> c.isDigit() || c == '.' }) amountStr = it },
                        label = { Text("Valor (R$) *", color = TextGray) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = PrimaryBlue, unfocusedBorderColor = InputBorder),
                        modifier = Modifier.weight(1f)
                    )

                    // Tipo (Despesa/Receita)
                    Box(Modifier.weight(1f)) {
                        OutlinedTextField(
                            value = type, onValueChange = {}, label = { Text("Tipo", color = TextGray) }, readOnly = true,
                            trailingIcon = { IconButton(onClick = { showTypeMenu = true }) { Icon(Icons.Default.ArrowDropDown, null, tint = TextGray) } },
                            colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = PrimaryBlue, unfocusedBorderColor = InputBorder),
                            modifier = Modifier.fillMaxWidth()
                        )
                        DropdownMenu(expanded = showTypeMenu, onDismissRequest = { showTypeMenu = false }, modifier = Modifier.background(CardBackground)) {
                            listOf("Despesa", "Receita").forEach { item ->
                                DropdownMenuItem(text = { Text(item, color = if(item=="Despesa") Color.Red else FinanceGreen) }, onClick = { type = item; showTypeMenu = false })
                            }
                        }
                    }
                }

                // Dropdown de Contas
                Box(Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                    OutlinedTextField(
                        value = selectedAccount?.name ?: "Selecione uma conta", onValueChange = {}, label = { Text("Conta *", color = TextGray) }, readOnly = true,
                        trailingIcon = { IconButton(onClick = { showAccountMenu = true }) { Icon(Icons.Default.ArrowDropDown, null, tint = TextGray) } },
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = PrimaryBlue, unfocusedBorderColor = InputBorder),
                        modifier = Modifier.fillMaxWidth()
                    )
                    DropdownMenu(expanded = showAccountMenu, onDismissRequest = { showAccountMenu = false }, modifier = Modifier.background(CardBackground)) {
                        accounts.forEach { account ->
                            DropdownMenuItem(text = { Text(account.name, color = TextWhite) }, onClick = { selectedAccount = account; showAccountMenu = false })
                        }
                    }
                }

                CustomInput(value = category, onValueChange = { category = it }, label = "Categoria")
                CustomInput(value = date, onValueChange = { date = it }, label = "Data (aaaa-mm-dd)")

                Spacer(Modifier.height(24.dp))
                Button(
                    onClick = {
                        if (selectedAccount != null) {
                            // Se for despesa, converte para 'expense', se receita 'income'
                            val apiType = if (type == "Despesa") "expense" else "income"
                            onConfirm(description, amountStr.toDoubleOrNull() ?: 0.0, apiType, selectedAccount!!.id!!, category, date)
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                    modifier = Modifier.fillMaxWidth()
                ) { Text("Salvar", color = Color.Black) }
            }
        }
    }
}