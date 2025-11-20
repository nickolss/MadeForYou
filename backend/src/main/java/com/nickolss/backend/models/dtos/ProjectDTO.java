package com.nickolss.backend.models.dtos;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class ProjectDTO {
    private Long id;
    private String name;
    private String description;
    private Integer progress;
    private String status;
    private String priority;
    private LocalDate startDate;
    private LocalDate dueDate;
    private String color;
    private LocalDateTime createdAt;
}