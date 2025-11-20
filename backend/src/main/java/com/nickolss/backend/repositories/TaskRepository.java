package com.nickolss.backend.repositories;

import com.nickolss.backend.models.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<TaskEntity, Long> {

    // Busca todas as tarefas do usuário ordenadas por criação (mais recentes primeiro)
    List<TaskEntity> findByUserIdOrderByCreatedAtDesc(String userId);

    // Busca segura para garantir que a tarefa pertence ao usuário antes de editar/deletar
    Optional<TaskEntity> findByIdAndUserId(Long id, String userId);
}