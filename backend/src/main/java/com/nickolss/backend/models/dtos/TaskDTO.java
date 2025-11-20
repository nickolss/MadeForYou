package com.nickolss.backend.models.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TaskDTO {
    private Long id;
    private String text;
    private Boolean completed;
    private String priority;
    private String category;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
}