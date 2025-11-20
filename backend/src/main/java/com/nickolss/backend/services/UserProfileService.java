package com.nickolss.backend.services;

import com.nickolss.backend.models.UserProfileEntity;
import com.nickolss.backend.models.dtos.UserProfileDTO;
import com.nickolss.backend.repositories.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserProfileService {

    private final UserProfileRepository repository;

    public UserProfileService(UserProfileRepository repository) {
        this.repository = repository;
    }

    // --- Mappers Auxiliares ---
    private UserProfileDTO toDTO(UserProfileEntity entity) {
        return UserProfileDTO.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .displayName(entity.getDisplayName())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .avatarUrl(entity.getAvatarUrl())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    // --- Lógica de Negócio ---
    public UserProfileDTO syncUserProfile(String firebaseUid, String email, String displayName) {
        Optional<UserProfileEntity> existingOpt = repository.findById(firebaseUid);
        UserProfileEntity entity;

        if (existingOpt.isPresent()) {
            // Update
            entity = existingOpt.get();
            // Atualizamos o email caso tenha mudado no provider
            entity.setEmail(email);
            // Só atualiza display name se foi passado um novo
            if (displayName != null && !displayName.isBlank()) {
                entity.setDisplayName(displayName);
            }
        } else {
            // Insert
            entity = new UserProfileEntity();
            entity.setId(firebaseUid);
            entity.setEmail(email);
            entity.setDisplayName(displayName != null ? displayName : email.split("@")[0]);
            entity.setCreatedAt(LocalDateTime.now());
        }

        entity.setUpdatedAt(LocalDateTime.now());

        UserProfileEntity saved = repository.save(entity);
        return toDTO(saved);
    }

    public UserProfileDTO getUserProfile(String userId) {
        return repository.findById(userId)
                .map(this::toDTO)
                .orElse(null);
    }

    /**
     * Atualização Parcial (Patch)
     */
    public UserProfileDTO updateUserProfile(String userId, UserProfileDTO updates) {
        UserProfileEntity entity = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + userId));

        // Verifica cada campo: se veio no DTO, atualiza na Entity
        if (updates.getDisplayName() != null) entity.setDisplayName(updates.getDisplayName());
        if (updates.getFirstName() != null) entity.setFirstName(updates.getFirstName());
        if (updates.getLastName() != null) entity.setLastName(updates.getLastName());
        if (updates.getAvatarUrl() != null) entity.setAvatarUrl(updates.getAvatarUrl());

        entity.setUpdatedAt(LocalDateTime.now());

        return toDTO(repository.save(entity));
    }
}