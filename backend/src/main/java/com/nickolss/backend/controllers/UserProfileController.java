package com.nickolss.backend.controllers;

import com.nickolss.backend.models.dtos.UserProfileDTO;
import com.nickolss.backend.services.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Usuários", description = "Gerenciamento de perfil de usuário")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping("/sync")
    @Operation(summary = "Sincronizar Perfil", description = "Cria ou atualiza o usuário (Upsert). Deve ser chamado após login no Firebase.")
    public ResponseEntity<UserProfileDTO> syncUser(
            @RequestBody SyncRequest request
    ) {
        UserProfileDTO result = userProfileService.syncUserProfile(
                request.id,
                request.email,
                request.displayName
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar Perfil", description = "Retorna os dados do perfil do usuário pelo ID (UID).")
    public ResponseEntity<UserProfileDTO> getUser(
            @Parameter(description = "Firebase UID") @PathVariable String id
    ) {
        UserProfileDTO user = userProfileService.getUserProfile(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar Perfil", description = "Atualiza campos específicos do perfil.")
    public ResponseEntity<UserProfileDTO> updateUser(
            @PathVariable String id,
            @RequestBody UserProfileDTO updates
    ) {
        try {
            return ResponseEntity.ok(userProfileService.updateUserProfile(id, updates));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    public record SyncRequest(String id, String email, String displayName) {}
}