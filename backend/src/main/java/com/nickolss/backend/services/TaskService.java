package com.nickolss.backend.services;

import com.nickolss.backend.models.TaskEntity;
import com.nickolss.backend.models.dtos.TaskDTO;
import com.nickolss.backend.repositories.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // --- Mapper Auxiliar ---
    private TaskDTO toDTO(TaskEntity entity) {
        return TaskDTO.builder()
                .id(entity.getId())
                .text(entity.getText())
                .completed(entity.getCompleted())
                .priority(entity.getPriority())
                .category(entity.getCategory())
                .dueDate(entity.getDueDate())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    // --- Métodos de Negócio ---

    public List<TaskDTO> getTasks(String userId) {
        return taskRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TaskDTO createTask(String userId, TaskDTO dto) {
        TaskEntity entity = new TaskEntity();
        entity.setUserId(userId);
        entity.setText(dto.getText());
        // Se não vier no DTO, assume false (padrão)
        entity.setCompleted(dto.getCompleted() != null ? dto.getCompleted() : false);
        entity.setPriority(dto.getPriority());
        entity.setCategory(dto.getCategory());
        entity.setDueDate(dto.getDueDate());

        // Atualiza o updated_at inicial
        entity.setUpdatedAt(LocalDateTime.now());

        return toDTO(taskRepository.save(entity));
    }

    public TaskDTO updateTask(String userId, Long taskId, TaskDTO updates) {
        TaskEntity entity = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada ou acesso negado"));

        // Lógica de Patch (Só atualiza o que foi enviado)
        if (updates.getText() != null) entity.setText(updates.getText());
        if (updates.getCompleted() != null) entity.setCompleted(updates.getCompleted());
        if (updates.getPriority() != null) entity.setPriority(updates.getPriority());
        if (updates.getCategory() != null) entity.setCategory(updates.getCategory());
        if (updates.getDueDate() != null) entity.setDueDate(updates.getDueDate());

        entity.setUpdatedAt(LocalDateTime.now());

        return toDTO(taskRepository.save(entity));
    }

    public void deleteTask(String userId, Long taskId) {
        TaskEntity entity = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada ou acesso negado"));

        taskRepository.delete(entity);
    }
}