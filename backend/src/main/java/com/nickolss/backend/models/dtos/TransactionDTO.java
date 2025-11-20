package com.nickolss.backend.models.dtos;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class TransactionDTO {
    private Long id;
    private Long accountId;
    private String description;
    private BigDecimal amount;
    private String type; // "income" | "expense"
    private String category;
    private LocalDate date;
}