package com.nickolss.backend.services;

import com.nickolss.backend.models.ProjectEntity;
import com.nickolss.backend.models.dtos.ProjectDTO;
import com.nickolss.backend.repositories.ProjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // --- Mapper Auxiliar ---
    private ProjectDTO toDTO(ProjectEntity entity) {
        return ProjectDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .progress(entity.getProgress())
                .status(entity.getStatus())
                .priority(entity.getPriority())
                .startDate(entity.getStartDate())
                .dueDate(entity.getDueDate())
                .color(entity.getColor())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    // --- Métodos de Negócio ---
    public List<ProjectDTO> getProjects(String userId) {
        return projectRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProjectDTO createProject(String userId, ProjectDTO dto) {
        ProjectEntity entity = new ProjectEntity();
        entity.setUserId(userId);
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setProgress(dto.getProgress() != null ? dto.getProgress() : 0);
        entity.setStatus(dto.getStatus());
        entity.setPriority(dto.getPriority());
        entity.setStartDate(dto.getStartDate());
        entity.setDueDate(dto.getDueDate());
        entity.setColor(dto.getColor());

        entity.setUpdatedAt(LocalDateTime.now());

        return toDTO(projectRepository.save(entity));
    }

    public ProjectDTO updateProject(String userId, Long projectId, ProjectDTO updates) {
        ProjectEntity entity = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado ou acesso negado"));

        // Lógica de Patch (Atualização Parcial)
        if (updates.getName() != null) entity.setName(updates.getName());
        if (updates.getDescription() != null) entity.setDescription(updates.getDescription());
        if (updates.getProgress() != null) entity.setProgress(updates.getProgress());
        if (updates.getStatus() != null) entity.setStatus(updates.getStatus());
        if (updates.getPriority() != null) entity.setPriority(updates.getPriority());
        if (updates.getStartDate() != null) entity.setStartDate(updates.getStartDate());
        if (updates.getDueDate() != null) entity.setDueDate(updates.getDueDate());
        if (updates.getColor() != null) entity.setColor(updates.getColor());

        entity.setUpdatedAt(LocalDateTime.now());

        return toDTO(projectRepository.save(entity));
    }

    public void deleteProject(String userId, Long projectId) {
        ProjectEntity entity = projectRepository.findByIdAndUserId(projectId, userId)
                .orElseThrow(() -> new RuntimeException("Projeto não encontrado ou acesso negado"));

        projectRepository.delete(entity);
    }
}