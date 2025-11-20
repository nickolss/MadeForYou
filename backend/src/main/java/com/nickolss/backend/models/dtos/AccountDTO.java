package com.nickolss.backend.models.dtos;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AccountDTO {
    private Long id;
    private String name;
    private String type;
    private BigDecimal balance;
    private String bank;
}