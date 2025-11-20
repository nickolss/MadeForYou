package com.nickolss.backend.controllers;

import com.nickolss.backend.models.dtos.TaskDTO;
import com.nickolss.backend.services.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tarefas", description = "Gerenciamento de lista de tarefas (To-Do)")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    @Operation(summary = "Listar Tarefas", description = "Retorna todas as tarefas do usuário ordenadas por criação.")
    public ResponseEntity<List<TaskDTO>> getTasks(
            @Parameter(description = "ID do usuário", required = true)
            @RequestParam String userId
    ) {
        return ResponseEntity.ok(taskService.getTasks(userId));
    }

    @PostMapping
    @Operation(summary = "Criar Tarefa")
    public ResponseEntity<TaskDTO> createTask(
            @RequestParam String userId,
            @RequestBody TaskDTO task
    ) {
        return ResponseEntity.ok(taskService.createTask(userId, task));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar Tarefa", description = "Atualiza parcialmente a tarefa (ex: marcar como completa).")
    public ResponseEntity<TaskDTO> updateTask(
            @RequestParam String userId,
            @PathVariable Long id,
            @RequestBody TaskDTO updates
    ) {
        try {
            return ResponseEntity.ok(taskService.updateTask(userId, id, updates));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar Tarefa")
    public ResponseEntity<Void> deleteTask(
            @RequestParam String userId,
            @PathVariable Long id
    ) {
        try {
            taskService.deleteTask(userId, id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}