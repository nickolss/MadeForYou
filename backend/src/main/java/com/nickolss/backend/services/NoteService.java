package com.nickolss.backend.services;


import com.nickolss.backend.models.NoteEntity;
import com.nickolss.backend.models.dtos.NoteDTO;
import com.nickolss.backend.repositories.NoteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoteService {

    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    // --- Mapper ---
    private NoteDTO toDTO(NoteEntity entity) {
        return NoteDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .category(entity.getCategory())
                .tags(entity.getTags())
                .isPinned(entity.getIsPinned())
                .color(entity.getColor())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    // --- Métodos ---
    public List<NoteDTO> getNotes(String userId) {
        return noteRepository.findByUserIdOrderByIsPinnedDescUpdatedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public NoteDTO createNote(String userId, NoteDTO dto) {
        NoteEntity entity = new NoteEntity();
        entity.setUserId(userId);
        entity.setTitle(dto.getTitle());
        entity.setContent(dto.getContent());
        entity.setCategory(dto.getCategory());
        entity.setTags(dto.getTags());
        entity.setIsPinned(dto.getIsPinned() != null ? dto.getIsPinned() : false);
        entity.setColor(dto.getColor());

        entity.setUpdatedAt(LocalDateTime.now());

        return toDTO(noteRepository.save(entity));
    }

    public NoteDTO updateNote(String userId, Long noteId, NoteDTO updates) {
        NoteEntity entity = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new RuntimeException("Nota não encontrada ou acesso negado"));

        // Atualização Parcial (Patch logic)
        if (updates.getTitle() != null) entity.setTitle(updates.getTitle());
        if (updates.getContent() != null) entity.setContent(updates.getContent());
        if (updates.getCategory() != null) entity.setCategory(updates.getCategory());
        if (updates.getTags() != null) entity.setTags(updates.getTags());
        if (updates.getIsPinned() != null) entity.setIsPinned(updates.getIsPinned());
        if (updates.getColor() != null) entity.setColor(updates.getColor());

        entity.setUpdatedAt(LocalDateTime.now());

        return toDTO(noteRepository.save(entity));
    }

    public void deleteNote(String userId, Long noteId) {
        NoteEntity entity = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> new RuntimeException("Nota não encontrada ou acesso negado"));

        noteRepository.delete(entity);
    }
}
