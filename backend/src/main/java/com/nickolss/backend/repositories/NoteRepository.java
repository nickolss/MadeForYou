package com.nickolss.backend.repositories;

import com.nickolss.backend.models.NoteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<NoteEntity, Long> {

    // Ordenação: Pinados primeiro (DESC), depois os mais recentes (DESC)
    List<NoteEntity> findByUserIdOrderByIsPinnedDescUpdatedAtDesc(String userId);

    // Para garantir que só deletamos/atualizamos notas que pertencem ao usuário
    Optional<NoteEntity> findByIdAndUserId(Long id, String userId);
}