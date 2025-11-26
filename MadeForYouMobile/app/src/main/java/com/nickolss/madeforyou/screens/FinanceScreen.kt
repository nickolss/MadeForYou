package com.nickolss.madeforyou.screens

import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nickolss.madeforyou.components.Account
import com.nickolss.madeforyou.components.AddAccountDialog
import com.nickolss.madeforyou.components.AddTransactionDialog
import com.nickolss.madeforyou.data.FinanceRepository
import com.nickolss.madeforyou.components.Transaction
import com.nickolss.madeforyou.ui.theme.CardBackground
import com.nickolss.madeforyou.ui.theme.DarkBackground
import com.nickolss.madeforyou.ui.theme.FinanceGreen
import com.nickolss.madeforyou.ui.theme.PrimaryBlue
import com.nickolss.madeforyou.ui.theme.TextGray
import com.nickolss.madeforyou.ui.theme.TextWhite
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FinanceScreen(userId: String, onBack: () -> Unit) {
    val repo = remember { FinanceRepository() }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    val accounts = remember { mutableStateListOf<Account>() }
    val transactions = remember { mutableStateListOf<Transaction>() }

    // Carregar Dados
    fun loadData() {
        scope.launch {
            val accs = repo.getAccounts(userId)
            accounts.clear(); accounts.addAll(accs)

            val trans = repo.getTransactions(userId)
            transactions.clear(); transactions.addAll(trans)
        }
    }

    LaunchedEffect(userId) { loadData() }

    // Calcula Saldo Total (Soma dos saldos das contas)
    val totalBalance = accounts.sumOf { it.balance }

    var showAccountDialog by remember { mutableStateOf(false) }
    var showTransactionDialog by remember { mutableStateOf(false) }

    Scaffold(
        containerColor = DarkBackground,
        modifier = Modifier.padding(top = 32.dp),
        topBar = {
            Row(Modifier.fillMaxWidth().padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, null, tint = TextWhite) }
                    Text("Finanças", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                }
                Row {
                    // Botão Nova Conta
                    Button(onClick = { showAccountDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = CardBackground),
                        shape = RoundedCornerShape(8.dp), modifier = Modifier.padding(end = 8.dp)) {
                        Icon(Icons.Default.AccountBalanceWallet, null, tint = PrimaryBlue)
                        Spacer(Modifier.width(4.dp))
                        Text("Conta", color = PrimaryBlue)
                    }
                    // Botão Nova Transação
                    Button(onClick = {
                        if (accounts.isEmpty()) {
                            Toast.makeText(context, "Crie uma conta primeiro!", Toast.LENGTH_SHORT).show()
                        } else {
                            showTransactionDialog = true
                        }
                    }, colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue), shape = RoundedCornerShape(8.dp)) {
                        Icon(Icons.Default.Add, null, tint = Color.Black)
                        Text("Transação", color = Color.Black)
                    }
                }
            }
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).padding(16.dp)) {

            // CARD DE SALDO GERAL
            Card(colors = CardDefaults.cardColors(containerColor = CardBackground), shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()) {
                Row(Modifier.padding(24.dp).fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Text("Minhas Contas", color = TextWhite, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Text("R$ ${String.format("%.2f", totalBalance)}", color = PrimaryBlue, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(Modifier.height(24.dp))
            Text("Transações Recentes", color = TextWhite, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))

            // LISTA DE TRANSAÇÕES
            LazyColumn {
                items(transactions) { t ->
                    Card(colors = CardDefaults.cardColors(containerColor = CardBackground), shape = RoundedCornerShape(8.dp), modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                        Row(Modifier.padding(16.dp).fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                            // Ícone (Seta pra cima ou baixo)
                            Icon(
                                imageVector = if(t.type == "income") Icons.Default.ArrowUpward else Icons.Default.ArrowDownward,
                                contentDescription = null,
                                tint = if(t.type == "income") FinanceGreen else Color.Red,
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(Modifier.width(16.dp))
                            Column(Modifier.weight(1f)) {
                                Text(t.description, color = TextWhite, fontWeight = FontWeight.Bold)
                                Text("${t.category} • ${t.date}", color = TextGray, fontSize = 12.sp)
                            }
                            Text(
                                text = (if(t.type == "expense") "- " else "+ ") + "R$ ${String.format("%.2f", t.amount)}",
                                color = if(t.type == "expense") Color(0xFFFF5252) else FinanceGreen,
                                fontWeight = FontWeight.Bold
                            )
                            IconButton(onClick = {
                                scope.launch {
                                    if (t.id != null) {
                                        val success = repo.deleteTransaction(t.id, userId)
                                        if (success) loadData() // Recarrega para atualizar saldo
                                    }
                                }
                            }) {
                                Icon(Icons.Outlined.Delete, null, tint = TextGray, modifier = Modifier.size(20.dp))
                            }
                        }
                    }
                }
                if (transactions.isEmpty()) {
                    item { Text("Nenhuma transação registrada", color = TextGray, modifier = Modifier.padding(16.dp)) }
                }
            }
        }
    }

    // --- DIÁLOGOS ---

    if (showAccountDialog) {
        AddAccountDialog(
            onDismiss = { showAccountDialog = false },
            onConfirm = { name, type, balance, bank ->
                scope.launch {
                    val newAcc = Account(userId = userId, name = name, type = type, balance = balance, bank = bank)
                    if (repo.saveAccount(newAcc)) {
                        loadData()
                        showAccountDialog = false
                    }
                }
            }
        )
    }

    if (showTransactionDialog) {
        AddTransactionDialog(
            accounts = accounts,
            onDismiss = { showTransactionDialog = false },
            onConfirm = { desc, value, type, accId, cat, date ->
                scope.launch {
                    val newTrans = Transaction(
                        userId = userId,
                        accountId = accId,
                        description = desc,
                        amount = value,
                        type = type,
                        category = cat,
                        date = date
                    )
                    if (repo.saveTransaction(newTrans)) {
                        loadData() // Recarrega saldo e lista
                        showTransactionDialog = false
                    }
                }
            }
        )
    }
}