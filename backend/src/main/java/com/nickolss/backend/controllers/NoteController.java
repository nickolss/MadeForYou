package com.nickolss.backend.controllers;

import com.nickolss.backend.models.dtos.NoteDTO;
import com.nickolss.backend.services.NoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@Tag(name = "Notas", description = "Gerenciamento de anotações pessoais")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    @Operation(summary = "Listar Notas", description = "Retorna notas ordenadas por fixadas e data de atualização.")
    public ResponseEntity<List<NoteDTO>> getNotes(@RequestParam String userId) {
        return ResponseEntity.ok(noteService.getNotes(userId));
    }

    @PostMapping
    @Operation(summary = "Criar Nota")
    public ResponseEntity<NoteDTO> createNote(
            @RequestParam String userId,
            @RequestBody NoteDTO note) {
        return ResponseEntity.ok(noteService.createNote(userId, note));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar Nota", description = "Atualiza apenas os campos enviados.")
    public ResponseEntity<NoteDTO> updateNote(
            @RequestParam String userId,
            @PathVariable Long id,
            @RequestBody NoteDTO updates) {
        try {
            return ResponseEntity.ok(noteService.updateNote(userId, id, updates));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar Nota")
    public ResponseEntity<Void> deleteNote(
            @RequestParam String userId,
            @PathVariable Long id) {
        try {
            noteService.deleteNote(userId, id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}