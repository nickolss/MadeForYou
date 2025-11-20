package com.nickolss.backend.services;

import com.nickolss.backend.models.HabitEntity;
import com.nickolss.backend.models.HabitEntryEntity;
import com.nickolss.backend.models.dtos.HabitDTO;
import com.nickolss.backend.models.dtos.HabitEntryDTO;
import com.nickolss.backend.repositories.HabitEntryRepository;
import com.nickolss.backend.repositories.HabitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitEntryRepository habitEntryRepository;

    public HabitService(HabitRepository habitRepository, HabitEntryRepository habitEntryRepository) {
        this.habitRepository = habitRepository;
        this.habitEntryRepository = habitEntryRepository;
    }

    // --- MAPPERS ---
    private HabitDTO convertToHabitDTO(HabitEntity entity) {
        return HabitDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .color(entity.getColor())
                .frequency(entity.getFrequency())
                .targetDays(entity.getTargetDays())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private HabitEntryDTO convertToEntryDTO(HabitEntryEntity entity) {
        return HabitEntryDTO.builder()
                .id(entity.getId())
                .habitId(entity.getHabitId())
                .date(entity.getDate())
                .completed(entity.getCompleted())
                .notes(entity.getNotes())
                .build();
    }

    // --- HABITS ---
    public List<HabitDTO> getHabits(String userId) {
        return habitRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToHabitDTO)
                .collect(Collectors.toList());
    }

    public HabitDTO createHabit(String userId, HabitDTO dto) {
        HabitEntity entity = new HabitEntity();
        entity.setUserId(userId);
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setColor(dto.getColor());
        entity.setFrequency(dto.getFrequency());
        entity.setTargetDays(dto.getTargetDays());
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        return convertToHabitDTO(habitRepository.save(entity));
    }

    public HabitDTO updateHabit(String userId, Long habitId, HabitDTO updates) {
        HabitEntity entity = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Hábito não encontrado"));

        if (!entity.getUserId().equals(userId)) throw new RuntimeException("Acesso negado");

        if (updates.getName() != null) entity.setName(updates.getName());
        if (updates.getDescription() != null) entity.setDescription(updates.getDescription());
        if (updates.getColor() != null) entity.setColor(updates.getColor());
        if (updates.getFrequency() != null) entity.setFrequency(updates.getFrequency());
        if (updates.getTargetDays() != null) entity.setTargetDays(updates.getTargetDays());

        entity.setUpdatedAt(LocalDateTime.now());
        return convertToHabitDTO(habitRepository.save(entity));
    }

    public void deleteHabit(String userId, Long habitId) {
        HabitEntity entity = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Hábito não encontrado"));

        if (!entity.getUserId().equals(userId)) throw new RuntimeException("Acesso negado");

        habitRepository.delete(entity);
    }

    // --- HABIT ENTRIES (Histórico e Checks) ---
    public List<HabitEntryDTO> getHabitEntries(String userId, Long habitId, LocalDate startDate, LocalDate endDate) {
        try {
            return habitEntryRepository.findEntries(userId, habitId, startDate, endDate)
                    .stream()
                    .map(this::convertToEntryDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar entradas: " + e.getMessage());
        }
    }

    /**
     * UPSERT: Cria ou Atualiza uma entrada.
     * Usado quando o usuário marca/desmarca ou anota algo num dia.
     */
    public HabitEntryDTO upsertHabitEntry(String userId, HabitEntryDTO dto) {
        // Verifica se já existe entrada para este hábito nesta data
        Optional<HabitEntryEntity> existingOpt = habitEntryRepository
                .findByUserIdAndHabitIdAndDate(userId, dto.getHabitId(), dto.getDate());

        HabitEntryEntity entity;

        if (existingOpt.isPresent()) {
            // Atualizar
            entity = existingOpt.get();
            if (dto.getCompleted() != null) entity.setCompleted(dto.getCompleted());
            if (dto.getNotes() != null) entity.setNotes(dto.getNotes());
        } else {
            // Criar Novo
            entity = new HabitEntryEntity();
            entity.setUserId(userId);
            entity.setHabitId(dto.getHabitId());
            entity.setDate(dto.getDate());
            entity.setCompleted(dto.getCompleted() != null ? dto.getCompleted() : true);
            entity.setNotes(dto.getNotes());
            entity.setCreatedAt(LocalDateTime.now());
        }

        return convertToEntryDTO(habitEntryRepository.save(entity));
    }

    public void deleteHabitEntry(String userId, Long entryId) {
        HabitEntryEntity entity = habitEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Entrada não encontrada"));

        if (!entity.getUserId().equals(userId)) throw new RuntimeException("Acesso negado");

        habitEntryRepository.delete(entity);
    }
}