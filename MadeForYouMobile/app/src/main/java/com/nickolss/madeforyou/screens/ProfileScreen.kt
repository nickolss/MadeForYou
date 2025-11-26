package com.nickolss.madeforyou.screens

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Save
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.google.firebase.auth.FirebaseAuth
import com.nickolss.madeforyou.components.CustomInput
import com.nickolss.madeforyou.data.UserRepository
import com.nickolss.madeforyou.ui.theme.CardBackground
import com.nickolss.madeforyou.ui.theme.DarkBackground
import com.nickolss.madeforyou.ui.theme.InputBorder
import com.nickolss.madeforyou.ui.theme.PrimaryBlue
import com.nickolss.madeforyou.ui.theme.TextGray
import com.nickolss.madeforyou.ui.theme.TextWhite
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(userId: String, onBack: () -> Unit, onLogout: () -> Unit) {
    val userRepo = remember { UserRepository() }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    val firebaseAuth = FirebaseAuth.getInstance()

    // Estados dos Campos
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var displayName by remember { mutableStateOf("") } // Nome de exibição (apelido)

    // Campos Visuais (Não salvam no banco, conforme pedido)
    var phone by remember { mutableStateOf("") }
    var bio by remember { mutableStateOf("") }

    // Campos de Senha
    var currentPassword by remember { mutableStateOf("") }
    var newPassword by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }

    // Carregar Dados
    LaunchedEffect(userId) {
        val profile = userRepo.getUserProfile(userId)
        if (profile != null) {
            firstName = profile.firstName ?: ""
            lastName = profile.lastName ?: ""
            email = profile.email
            displayName = profile.displayName ?: ""
        } else {
            // Fallback se a API falhar, pega do Firebase
            email = firebaseAuth.currentUser?.email ?: ""
            displayName = firebaseAuth.currentUser?.displayName ?: ""
        }
    }

    Scaffold(
        containerColor = DarkBackground,
        modifier = Modifier.padding(top = 32.dp),
        topBar = {
            TopAppBar(
                title = { Text("Meu Perfil", color = TextWhite, fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DarkBackground),
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, null, tint = TextWhite) }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .padding(16.dp)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            Text("Gerencie suas informações pessoais e configurações da conta", color = TextGray, fontSize = 14.sp)
            Spacer(Modifier.height(24.dp))

            // --- CARD 1: FOTO DE PERFIL ---
            Card(colors = CardDefaults.cardColors(containerColor = CardBackground), shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(24.dp).fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                    Box {
                        // Avatar Placeholder (Bola com Inicial)
                        Box(
                            modifier = Modifier
                                .size(100.dp)
                                .clip(CircleShape)
                                .background(PrimaryBlue),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (firstName.isNotEmpty()) firstName.take(1).uppercase() else "U",
                                color = Color.White,
                                fontSize = 40.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        // Ícone de Câmera
                        IconButton(
                            onClick = { Toast.makeText(context, "Upload de imagem em breve!", Toast.LENGTH_SHORT).show() },
                            modifier = Modifier
                                .align(Alignment.BottomEnd)
                                .background(Color.White, CircleShape)
                                .size(32.dp)
                        ) {
                            Icon(Icons.Default.CameraAlt, null, tint = PrimaryBlue, modifier = Modifier.size(20.dp))
                        }
                    }
                    Spacer(Modifier.height(16.dp))
                    Text("Foto de Perfil", color = TextWhite, fontWeight = FontWeight.Bold)
                    Text("JPG, PNG ou GIF. Máximo 5MB", color = TextGray, fontSize = 12.sp)
                }
            }

            Spacer(Modifier.height(24.dp))

            // --- CARD 2: INFORMAÇÕES PESSOAIS ---
            Card(colors = CardDefaults.cardColors(containerColor = CardBackground), shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(24.dp)) {
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Informações Pessoais", color = TextWhite, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        IconButton(onClick = {
                            scope.launch {
                                // Salva Nome e Sobrenome na API
                                val success = userRepo.updateUserProfile(userId, firstName, lastName, displayName)
                                if (success) Toast.makeText(context, "Perfil atualizado!", Toast.LENGTH_SHORT).show()
                                else Toast.makeText(context, "Erro ao atualizar.", Toast.LENGTH_SHORT).show()
                            }
                        }) {
                            Icon(Icons.Default.Save, null, tint = PrimaryBlue)
                        }
                    }
                    Spacer(Modifier.height(16.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        Box(Modifier.weight(1f)) { CustomInput(value = firstName, onValueChange = { firstName = it }, label = "Nome") }
                        Box(Modifier.weight(1f)) { CustomInput(value = lastName, onValueChange = { lastName = it }, label = "Sobrenome") }
                    }

                    // E-mail (Leitura apenas)
                    OutlinedTextField(
                        value = email, onValueChange = {}, label = { Text("E-mail", color = TextGray) },
                        readOnly = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = TextGray, unfocusedTextColor = TextGray,
                            focusedBorderColor = InputBorder, unfocusedBorderColor = InputBorder
                        ),
                        modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
                        shape = RoundedCornerShape(8.dp)
                    )
                    Text("O e-mail não pode ser alterado.", color = TextGray, fontSize = 10.sp, modifier = Modifier.padding(bottom = 8.dp))

                    // Campos Visuais
                    CustomInput(value = phone, onValueChange = { phone = it }, label = "Telefone")
                    Text("Não será salvo no banco (visual apenas)", color = TextGray, fontSize = 10.sp)

                    Spacer(Modifier.height(8.dp))
                    OutlinedTextField(
                        value = bio, onValueChange = { bio = it }, label = { Text("Biografia", color = TextGray) },
                        colors = OutlinedTextFieldDefaults.colors(focusedTextColor = TextWhite, unfocusedTextColor = TextWhite, focusedBorderColor = PrimaryBlue, unfocusedBorderColor = InputBorder),
                        modifier = Modifier.fillMaxWidth().height(100.dp),
                        shape = RoundedCornerShape(8.dp)
                    )
                }
            }

            Spacer(Modifier.height(24.dp))

            // --- CARD 3: SEGURANÇA ---
            Card(colors = CardDefaults.cardColors(containerColor = CardBackground), shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(24.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Lock, null, tint = PrimaryBlue)
                        Spacer(Modifier.width(8.dp))
                        Text("Segurança", color = TextWhite, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    }
                    Spacer(Modifier.height(16.dp))
                    Text("Alterar Senha", color = TextWhite, fontWeight = FontWeight.SemiBold)

                    // Inputs de Senha
                    CustomInput(value = currentPassword, onValueChange = { currentPassword = it }, label = "Senha Atual", isPassword = true)
                    CustomInput(value = newPassword, onValueChange = { newPassword = it }, label = "Nova Senha", isPassword = true)
                    CustomInput(value = confirmPassword, onValueChange = { confirmPassword = it }, label = "Confirmar Nova Senha", isPassword = true)

                    Spacer(Modifier.height(16.dp))
                    Button(
                        onClick = {
                            if (newPassword.isNotEmpty() && newPassword == confirmPassword) {
                                // Atualiza senha no Firebase
                                firebaseAuth.currentUser?.updatePassword(newPassword)
                                    ?.addOnCompleteListener { task ->
                                        if (task.isSuccessful) {
                                            Toast.makeText(context, "Senha alterada com sucesso!", Toast.LENGTH_SHORT).show()
                                            newPassword = ""; confirmPassword = ""; currentPassword = ""
                                        } else {
                                            Toast.makeText(context, "Erro: ${task.exception?.message}", Toast.LENGTH_SHORT).show()
                                        }
                                    }
                            } else {
                                Toast.makeText(context, "As senhas não conferem.", Toast.LENGTH_SHORT).show()
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Alterar Senha", color = Color.Black)
                    }
                }
            }

            Spacer(Modifier.height(24.dp))

            // --- CARD 4: SESSÕES ---
            Card(colors = CardDefaults.cardColors(containerColor = CardBackground), shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(24.dp)) {
                    Text("Sessões Ativas", color = TextWhite, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(8.dp))
                    Text("Você está logado neste dispositivo.", color = TextGray, fontSize = 14.sp)
                    Spacer(Modifier.height(16.dp))

                    Button(
                        onClick = onLogout,
                        colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color.Red),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Encerrar Todas as Sessões (Sair)", color = Color.Red)
                    }
                }
            }
        }
    }
}