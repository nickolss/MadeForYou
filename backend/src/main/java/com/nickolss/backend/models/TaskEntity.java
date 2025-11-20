package com.nickolss.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
public class TaskEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private Boolean completed = false; // Valor padrão

    // Valores esperados: 'low', 'medium', 'high'
    private String priority;

    private String category;

    @Column(name = "due_date")
    private LocalDate dueDate; // Data de vencimento (sem hora)

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}