package com.nickolss.backend.controllers;

import com.nickolss.backend.models.dtos.ProjectDTO;
import com.nickolss.backend.services.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@Tag(name = "Projetos", description = "Gerenciamento de projetos e tarefas macro")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "Listar Projetos", description = "Retorna todos os projetos do usuário.")
    public ResponseEntity<List<ProjectDTO>> getProjects(
            @Parameter(description = "ID do usuário", required = true)
            @RequestParam String userId
    ) {
        return ResponseEntity.ok(projectService.getProjects(userId));
    }

    @PostMapping
    @Operation(summary = "Criar Projeto")
    public ResponseEntity<ProjectDTO> createProject(
            @RequestParam String userId,
            @RequestBody ProjectDTO project
    ) {
        return ResponseEntity.ok(projectService.createProject(userId, project));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar Projeto", description = "Atualiza parcialmente os dados do projeto.")
    public ResponseEntity<ProjectDTO> updateProject(
            @RequestParam String userId,
            @PathVariable Long id,
            @RequestBody ProjectDTO updates
    ) {
        try {
            return ResponseEntity.ok(projectService.updateProject(userId, id, updates));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar Projeto")
    public ResponseEntity<Void> deleteProject(
            @RequestParam String userId,
            @PathVariable Long id
    ) {
        try {
            projectService.deleteProject(userId, id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}