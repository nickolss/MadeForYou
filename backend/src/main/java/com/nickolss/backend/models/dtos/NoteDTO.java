package com.nickolss.backend.models.dtos;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class NoteDTO {
    private Long id;
    private String title;
    private String content;
    private String category;
    private List<String> tags;
    private Boolean isPinned;
    private String color;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}