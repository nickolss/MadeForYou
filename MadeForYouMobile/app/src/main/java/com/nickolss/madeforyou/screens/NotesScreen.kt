package com.nickolss.madeforyou.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.Label
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.PushPin
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.outlined.PushPin
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
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nickolss.madeforyou.components.AddNoteDialog
import com.nickolss.madeforyou.components.Note
import com.nickolss.madeforyou.data.NoteRepository
import com.nickolss.madeforyou.components.TaskStatCard
import com.nickolss.madeforyou.ui.theme.CardBackground
import com.nickolss.madeforyou.ui.theme.DarkBackground
import com.nickolss.madeforyou.ui.theme.FinanceGreen
import com.nickolss.madeforyou.ui.theme.InputBorder
import com.nickolss.madeforyou.ui.theme.PrimaryBlue
import com.nickolss.madeforyou.ui.theme.TextGray
import com.nickolss.madeforyou.ui.theme.TextWhite
import kotlinx.coroutines.launch
import java.time.LocalDate

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotesScreen(userId: String, onBack: () -> Unit) {
    val repo = remember { NoteRepository() }
    val notes = remember { mutableStateListOf<Note>() }
    val scope = rememberCoroutineScope()

    fun loadNotes() {
        scope.launch {
            val loaded = repo.getNotes(userId)
            // Ordena: Fixados primeiro
            notes.clear()
            notes.addAll(loaded.sortedByDescending { it.isPinned })
        }
    }

    LaunchedEffect(userId) { loadNotes() }

    // Estados
    var showDialog by remember { mutableStateOf(false) }
    var noteToEdit by remember { mutableStateOf<Note?>(null) }
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("Todas as categorias") }

    // Estatísticas
    val totalNotes = notes.size
    val pinnedCount = notes.count { it.isPinned }
    val distinctCategories = notes.map { it.category }.filter { it.isNotEmpty() }.distinct()
    val categoriesCount = distinctCategories.size
    val thisWeekCount = notes.count { it.createdAt?.startsWith(LocalDate.now().year.toString()) == true }

    // Filtragem
    val filteredNotes = notes.filter { note ->
        val matchesSearch = note.title.contains(searchQuery, ignoreCase = true) || note.content.contains(searchQuery, ignoreCase = true)
        val matchesCat = if (selectedCategory == "Todas as categorias") true else note.category == selectedCategory
        matchesSearch && matchesCat
    }

    Scaffold(
        containerColor = DarkBackground,
        modifier = Modifier.padding(top = 32.dp),
        topBar = {
            Row(Modifier.fillMaxWidth().padding(16.dp), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onBack) { Icon(Icons.Default.ArrowBack, null, tint = TextWhite) }
                    Text("Minhas Notas", color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                }
                Button(onClick = { showDialog = true }, colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue), shape = RoundedCornerShape(8.dp)) {
                    Icon(Icons.Default.Add, null, tint = Color.Black)
                    Text("Nova Nota", color = Color.Black)
                }
            }
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).padding(16.dp)) {

            // Cards
            Row(Modifier.fillMaxWidth()) {
                TaskStatCard("Total", "$totalNotes", "Total de Notas", Icons.Default.Folder, PrimaryBlue, Modifier.weight(1f))
                TaskStatCard("Fixadas", "$pinnedCount", "Fixadas", Icons.Default.PushPin, Color(0xFFF59E0B), Modifier.weight(1f))
            }
            Row(Modifier.fillMaxWidth()) {
                TaskStatCard("Categorias", "$categoriesCount", "Categorias", Icons.Default.Label, Color(0xFF8B5CF6), Modifier.weight(1f))
                TaskStatCard("Semana", "$thisWeekCount", "Esta Semana", Icons.Default.DateRange, FinanceGreen, Modifier.weight(1f))
            }

            Spacer(Modifier.height(24.dp))

            // Busca e Filtro
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = searchQuery, onValueChange = { searchQuery = it },
                    placeholder = { Text("Buscar notas...", color = TextGray) },
                    prefix = { Icon(Icons.Default.Search, null, tint = TextGray) },
                    modifier = Modifier.weight(1f),
                    colors = OutlinedTextFieldDefaults.colors(focusedContainerColor = CardBackground, unfocusedContainerColor = CardBackground, focusedBorderColor = InputBorder, unfocusedBorderColor = InputBorder, focusedTextColor = TextWhite, unfocusedTextColor = TextWhite),
                    shape = RoundedCornerShape(8.dp)
                )

                // Dropdown de categoria
                var expandedCat by remember { mutableStateOf(false) }
                Box {
                    Button(onClick = { expandedCat = true }, colors = ButtonDefaults.buttonColors(containerColor = CardBackground), shape = RoundedCornerShape(8.dp), modifier = Modifier.height(56.dp)) {
                        Text(selectedCategory.take(10), color = TextGray, maxLines = 1)
                        Icon(Icons.Default.ArrowDropDown, null, tint = TextGray)
                    }
                    DropdownMenu(expanded = expandedCat, onDismissRequest = { expandedCat = false }, modifier = Modifier.background(CardBackground)) {
                        DropdownMenuItem(text = { Text("Todas as categorias", color = TextWhite) }, onClick = { selectedCategory = "Todas as categorias"; expandedCat = false })
                        distinctCategories.forEach { cat ->
                            DropdownMenuItem(text = { Text(cat, color = TextWhite) }, onClick = { selectedCategory = cat; expandedCat = false })
                        }
                    }
                }
            }

            Spacer(Modifier.height(16.dp))
            Text("Minhas Notas (${filteredNotes.size})", color = TextWhite, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))

            // Lista
            LazyColumn {
                items(filteredNotes) { note ->
                    NoteItem(
                        note = note,
                        userId = userId,
                        onEdit = {
                            noteToEdit = note.copy(userId = userId)
                            showDialog = true
                        },
                        onPinToggle = {
                            scope.launch {
                                val updated = note.copy(isPinned = !note.isPinned, userId = userId)
                                if (repo.saveNote(updated)) loadNotes()
                            }
                        },
                        onDelete = {
                            scope.launch {
                                if (note.id != null) {
                                    if (repo.deleteNote(note.id, userId)) notes.remove(note)
                                }
                            }
                        }
                    )
                }
                if (filteredNotes.isEmpty()) {
                    item { Text("Nenhuma nota encontrada.", color = TextGray, modifier = Modifier.padding(16.dp)) }
                }
            }
        }
    }

    if (showDialog) {
        AddNoteDialog(
            noteToEdit = noteToEdit,
            onDismiss = { showDialog = false; noteToEdit = null },
            onConfirm = { title, content, cat, tagsStr, isPinned, color ->
                scope.launch {
                    // Converte string de tags para lista
                    val tagList = tagsStr.split(",").map { it.trim() }.filter { it.isNotEmpty() }

                    val newNote = Note(
                        id = noteToEdit?.id,
                        userId = userId,
                        title = title,
                        content = content,
                        category = cat,
                        tags = tagList,
                        isPinned = isPinned,
                        color = color
                    )
                    if (repo.saveNote(newNote)) {
                        loadNotes()
                        showDialog = false
                        noteToEdit = null
                    }
                }
            }
        )
    }
}

@Composable
fun NoteItem(note: Note, userId: String, onEdit: () -> Unit, onPinToggle: () -> Unit, onDelete: () -> Unit) {
    var showMenu by remember { mutableStateOf(false) }
    val noteColor = try { Color(android.graphics.Color.parseColor(note.color)) } catch (e: Exception) { PrimaryBlue }

    Card(
        colors = CardDefaults.cardColors(containerColor = CardBackground),
        shape = RoundedCornerShape(8.dp),
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
            .border(if(note.isPinned) 1.dp else 0.dp, if(note.isPinned) PrimaryBlue else Color.Transparent, RoundedCornerShape(8.dp))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (note.isPinned) {
                        Icon(Icons.Default.PushPin, null, tint = PrimaryBlue, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(8.dp))
                    }
                    Text(note.title, color = TextWhite, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                }
                Box {
                    IconButton(onClick = { showMenu = true }) { Icon(Icons.Default.MoreVert, null, tint = TextGray) }
                    DropdownMenu(expanded = showMenu, onDismissRequest = { showMenu = false }, modifier = Modifier.background(CardBackground)) {
                        DropdownMenuItem(
                            text = { Text(if(note.isPinned) "Desafixar" else "Fixar", color = TextWhite) },
                            leadingIcon = { Icon(if(note.isPinned) Icons.Outlined.PushPin else Icons.Default.PushPin, null, tint = TextWhite) },
                            onClick = { showMenu = false; onPinToggle() }
                        )
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

            // Tags e Categoria
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                if (note.category.isNotEmpty()) {
                    Surface(color = noteColor.copy(0.2f), shape = RoundedCornerShape(4.dp)) {
                        Text(note.category, color = noteColor, fontSize = 10.sp, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                    }
                }
                note.tags.take(3).forEach { tag ->
                    Surface(color = Color.DarkGray, shape = RoundedCornerShape(4.dp)) {
                        Text(tag, color = TextGray, fontSize = 10.sp, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                    }
                }
            }

            Spacer(Modifier.height(8.dp))
            Text(note.content, color = TextGray, fontSize = 14.sp, maxLines = 3)
        }
    }
}
