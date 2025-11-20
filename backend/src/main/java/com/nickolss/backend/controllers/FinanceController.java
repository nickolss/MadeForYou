package com.nickolss.backend.controllers;

import com.nickolss.backend.models.dtos.AccountDTO;
import com.nickolss.backend.models.dtos.TransactionDTO;
import com.nickolss.backend.services.FinanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance")
@Tag(name = "Finanças", description = "Contas e Transações")
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    // --- ACCOUNTS ---
    @GetMapping("/accounts")
    @Operation(summary = "Listar Contas")
    public ResponseEntity<List<AccountDTO>> getAccounts(@RequestParam String userId) {
        return ResponseEntity.ok(financeService.getAccounts(userId));
    }

    @PostMapping("/accounts")
    @Operation(summary = "Criar Conta")
    public ResponseEntity<AccountDTO> createAccount(
            @RequestParam String userId, @RequestBody AccountDTO account) {
        return ResponseEntity.ok(financeService.createAccount(userId, account));
    }

    @PatchMapping("/accounts/{id}")
    @Operation(summary = "Atualizar Conta")
    public ResponseEntity<AccountDTO> updateAccount(
            @RequestParam String userId, @PathVariable Long id, @RequestBody AccountDTO updates) {
        return ResponseEntity.ok(financeService.updateAccount(userId, id, updates));
    }

    @DeleteMapping("/accounts/{id}")
    @Operation(summary = "Deletar Conta")
    public ResponseEntity<Void> deleteAccount(
            @RequestParam String userId, @PathVariable Long id) {
        financeService.deleteAccount(userId, id);
        return ResponseEntity.noContent().build();
    }

    // --- TRANSACTIONS ---
    @GetMapping("/transactions")
    @Operation(summary = "Listar Transações")
    public ResponseEntity<List<TransactionDTO>> getTransactions(
            @RequestParam String userId,
            @RequestParam(required = false) Long accountId) {
        return ResponseEntity.ok(financeService.getTransactions(userId, accountId));
    }

    @PostMapping("/transactions")
    @Operation(summary = "Criar Transação", description = "Cria transação e atualiza saldo da conta.")
    public ResponseEntity<TransactionDTO> createTransaction(
            @RequestParam String userId, @RequestBody TransactionDTO transaction) {
        return ResponseEntity.ok(financeService.createTransaction(userId, transaction));
    }

    @PatchMapping("/transactions/{id}")
    @Operation(summary = "Atualizar Transação", description = "Reverte saldo antigo e aplica novo.")
    public ResponseEntity<TransactionDTO> updateTransaction(
            @RequestParam String userId, @PathVariable Long id, @RequestBody TransactionDTO updates) {
        return ResponseEntity.ok(financeService.updateTransaction(userId, id, updates));
    }

    @DeleteMapping("/transactions/{id}")
    @Operation(summary = "Deletar Transação", description = "Reverte impacto no saldo da conta.")
    public ResponseEntity<Void> deleteTransaction(
            @RequestParam String userId, @PathVariable Long id) {
        financeService.deleteTransaction(userId, id);
        return ResponseEntity.noContent().build();
    }
}
