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
import java.util.stream.Collectors;

@Service
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitEntryRepository habitEntryRepository;

    public HabitService(HabitRepository habitRepository, HabitEntryRepository habitEntryRepository) {
        this.habitRepository = habitRepository;
        this.habitEntryRepository = habitEntryRepository;
    }

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

    public List<HabitDTO> getHabits(String userId) {
        try {
            return habitRepository.findByUserIdOrderByCreatedAtDesc(userId)
                    .stream()
                    .map(this::convertToHabitDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Erro ao buscar hábitos: " + e.getMessage());
            throw e;
        }
    }

    public List<HabitEntryDTO> getHabitEntries(String userId, Long habitId, LocalDate startDate, LocalDate endDate) {
        try {
            return habitEntryRepository.findEntries(userId, habitId, startDate, endDate)
                    .stream()
                    .map(this::convertToEntryDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Erro ao buscar entradas: " + e.getMessage());
            throw e;
        }
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

        HabitEntity savedEntity = habitRepository.save(entity);

        return convertToHabitDTO(savedEntity);
    }
}