package com.nickolss.backend.models.dtos;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class HabitDTO {
    private Long id;
    private String name;
    private String description;
    private String color;
    private String frequency;
    private Integer targetDays;
    private LocalDateTime createdAt;
}
