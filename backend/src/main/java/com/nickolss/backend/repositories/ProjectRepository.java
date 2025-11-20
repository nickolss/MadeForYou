package com.nickolss.backend.repositories;

import com.nickolss.backend.models.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

    // Busca todos do usuário ordenados por criação (mais recentes primeiro)
    List<ProjectEntity> findByUserIdOrderByCreatedAtDesc(String userId);

    // Busca segura para update/delete (garante que o projeto pertence ao usuário)
    Optional<ProjectEntity> findByIdAndUserId(Long id, String userId);
}