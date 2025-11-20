package com.nickolss.backend.controllers;

import com.nickolss.backend.models.dtos.HabitDTO;
import com.nickolss.backend.models.dtos.HabitEntryDTO;
import com.nickolss.backend.services.HabitService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Hábitos", description = "Endpoints para gerenciamento e consulta de hábitos")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    // --- HABITS ---
    @GetMapping("/habits")
    @Operation(summary = "Listar Hábitos", description = "Busca todos os hábitos cadastrados para um determinado usuário.")
    public ResponseEntity<List<HabitDTO>> getHabits(
            @Parameter(description = "ID do usuário", required = true)
            @RequestParam String userId) {
        return ResponseEntity.ok(habitService.getHabits(userId));
    }

    @PostMapping("/habits")
    public ResponseEntity<HabitDTO> createHabit(@RequestParam String userId, @RequestBody HabitDTO habitDTO) {
        return ResponseEntity.ok(habitService.createHabit(userId, habitDTO));
    }

    @PatchMapping("/habits/{id}")
    public ResponseEntity<HabitDTO> updateHabit(@RequestParam String userId, @PathVariable Long id, @RequestBody HabitDTO habitDTO) {
        return ResponseEntity.ok(habitService.updateHabit(userId, id, habitDTO));
    }

    @DeleteMapping("/habits/{id}")
    public ResponseEntity<Void> deleteHabit(@RequestParam String userId, @PathVariable Long id) {
        habitService.deleteHabit(userId, id);
        return ResponseEntity.noContent().build();
    }

    // --- ENTRIES ---
    @GetMapping("/entries")
    @Operation(summary = "Listar Histórico (Entries)", description = "Busca o histórico de execução dos hábitos com filtros de data e hábito específico.")
    public ResponseEntity<List<HabitEntryDTO>> getHabitEntries(
            @Parameter(description = "ID do usuário", required = true)
            @RequestParam String userId,

            @Parameter(description = "ID do hábito específico (opcional)")
            @RequestParam(required = false) Long habitId,

            @Parameter(description = "Data inicial para filtro (YYYY-MM-DD)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,

            @Parameter(description = "Data final para filtro (YYYY-MM-DD)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(habitService.getHabitEntries(userId, habitId, startDate, endDate));
    }

    @PostMapping("/entries")
    @Operation(summary = "Upsert Entry", description = "Cria ou atualiza uma entrada de hábito (check-in).")
    public ResponseEntity<HabitEntryDTO> upsertHabitEntry(@RequestParam String userId, @RequestBody HabitEntryDTO entryDTO) {
        return ResponseEntity.ok(habitService.upsertHabitEntry(userId, entryDTO));
    }

    @DeleteMapping("/entries/{id}")
    public ResponseEntity<Void> deleteHabitEntry(@RequestParam String userId, @PathVariable Long id) {
        habitService.deleteHabitEntry(userId, id);
        return ResponseEntity.noContent().build();
    }
}