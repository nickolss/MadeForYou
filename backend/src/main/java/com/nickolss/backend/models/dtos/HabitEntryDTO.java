package com.nickolss.backend.models.dtos;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class HabitEntryDTO {
    private Long id;
    private Long habitId;
    private LocalDate date;
    private Boolean completed;
    private String notes;
}
