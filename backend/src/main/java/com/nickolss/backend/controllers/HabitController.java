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

    @GetMapping("/habits")
    @Operation(summary = "Listar Hábitos", description = "Busca todos os hábitos cadastrados para um determinado usuário.")
    public ResponseEntity<List<HabitDTO>> getHabits(
            @Parameter(description = "ID do usuário", required = true)
            @RequestParam String userId) {
        return ResponseEntity.ok(habitService.getHabits(userId));
    }

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

    @PostMapping("/habits")
    @Operation(summary = "Criar Hábito", description = "Cria um novo hábito para o usuário especificado.")
    public ResponseEntity<HabitDTO> createHabit(
            @Parameter(description = "ID do usuário", required = true)
            @RequestParam String userId,

            @RequestBody HabitDTO habitDTO) {

        HabitDTO createdHabit = habitService.createHabit(userId, habitDTO);
        return ResponseEntity.ok(createdHabit);
    }


    @PatchMapping("/habits/{id}")
    @Operation(summary = "Atualizar Hábito", description = "Atualiza parcialmente os dados de um hábito.")
    public ResponseEntity<HabitDTO> updateHabit(
            @Parameter(description = "ID do usuário", required = true)
            @RequestParam String userId,

            @Parameter(description = "ID do hábito")
            @PathVariable Long id,

            @RequestBody HabitDTO habitDTO) {

        return ResponseEntity.ok(habitService.updateHabit(userId, id, habitDTO));
    }

    @DeleteMapping("/habits/{id}")
    @Operation(summary = "Deletar Hábito", description = "Remove um hábito e seus registros associados.")
    public ResponseEntity<Void> deleteHabit(
            @Parameter(description = "ID do usuário", required = true)
            @RequestParam String userId,

            @Parameter(description = "ID do hábito")
            @PathVariable Long id) {

        habitService.deleteHabit(userId, id);
        return ResponseEntity.noContent().build();
    }
}