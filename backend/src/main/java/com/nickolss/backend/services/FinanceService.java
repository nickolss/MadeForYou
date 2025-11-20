package com.nickolss.backend.services;

import com.nickolss.backend.models.AccountEntity;
import com.nickolss.backend.models.TransactionEntity;
import com.nickolss.backend.models.dtos.AccountDTO;
import com.nickolss.backend.models.dtos.TransactionDTO;
import com.nickolss.backend.repositories.AccountRepository;
import com.nickolss.backend.repositories.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FinanceService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public FinanceService(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    // --- ACCOUNT METHODS ---
    public List<AccountDTO> getAccounts(String userId) {
        return accountRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toAccountDTO).collect(Collectors.toList());
    }

    public AccountDTO createAccount(String userId, AccountDTO dto) {
        AccountEntity entity = new AccountEntity();
        entity.setUserId(userId);
        entity.setName(dto.getName());
        entity.setType(dto.getType());
        entity.setBalance(dto.getBalance() != null ? dto.getBalance() : BigDecimal.ZERO);
        entity.setBank(dto.getBank());
        entity.setUpdatedAt(LocalDateTime.now());

        return toAccountDTO(accountRepository.save(entity));
    }

    public AccountDTO updateAccount(String userId, Long accountId, AccountDTO updates) {
        AccountEntity entity = accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (updates.getName() != null) entity.setName(updates.getName());
        if (updates.getType() != null) entity.setType(updates.getType());
        if (updates.getBank() != null) entity.setBank(updates.getBank());
        if (updates.getBalance() != null) entity.setBalance(updates.getBalance());

        entity.setUpdatedAt(LocalDateTime.now());
        return toAccountDTO(accountRepository.save(entity));
    }

    public void deleteAccount(String userId, Long accountId) {
        AccountEntity entity = accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        accountRepository.delete(entity);
    }

    // --- TRANSACTION METHODS ---
    public List<TransactionDTO> getTransactions(String userId, Long accountId) {
        return transactionRepository.findTransactions(userId, accountId)
                .stream().map(this::toTransactionDTO).collect(Collectors.toList());
    }

    @Transactional // Garante atomicidade: cria transação E atualiza saldo ou falha tudo
    public TransactionDTO createTransaction(String userId, TransactionDTO dto) {
        // 1. Criar a transação
        TransactionEntity entity = new TransactionEntity();
        entity.setUserId(userId);
        entity.setAccountId(dto.getAccountId());
        entity.setDescription(dto.getDescription());
        entity.setAmount(dto.getAmount());
        entity.setType(dto.getType());
        entity.setCategory(dto.getCategory());
        entity.setDate(dto.getDate());

        TransactionEntity saved = transactionRepository.save(entity);

        // 2. Atualizar saldo da conta (Side effect)
        updateAccountBalance(userId, dto.getAccountId(), dto.getAmount(), dto.getType());

        return toTransactionDTO(saved);
    }

    @Transactional
    public TransactionDTO updateTransaction(String userId, Long transactionId, TransactionDTO updates) {
        // 1. Buscar transação antiga para reverter saldo
        TransactionEntity entity = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada"));

        // Reverter impacto da transação antiga
        revertAccountBalance(userId, entity.getAccountId(), entity.getAmount(), entity.getType());

        // 2. Atualizar dados
        if (updates.getDescription() != null) entity.setDescription(updates.getDescription());
        if (updates.getCategory() != null) entity.setCategory(updates.getCategory());
        if (updates.getDate() != null) entity.setDate(updates.getDate());

        // Se mudou conta, valor ou tipo, precisamos aplicar o novo saldo
        if (updates.getAccountId() != null) entity.setAccountId(updates.getAccountId());
        if (updates.getAmount() != null) entity.setAmount(updates.getAmount());
        if (updates.getType() != null) entity.setType(updates.getType());

        // 3. Aplicar novo impacto no saldo
        updateAccountBalance(userId, entity.getAccountId(), entity.getAmount(), entity.getType());

        return toTransactionDTO(transactionRepository.save(entity));
    }

    @Transactional
    public void deleteTransaction(String userId, Long transactionId) {
        TransactionEntity entity = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada"));

        // Reverter saldo antes de deletar
        revertAccountBalance(userId, entity.getAccountId(), entity.getAmount(), entity.getType());

        transactionRepository.delete(entity);
    }

    // --- HELPER METHODS (BALANCE LOGIC) ---

    private void updateAccountBalance(String userId, Long accountId, BigDecimal amount, String type) {
        AccountEntity account = accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new RuntimeException("Conta vinculada não encontrada"));

        BigDecimal adjustment = "income".equals(type) ? amount : amount.negate();
        account.setBalance(account.getBalance().add(adjustment));
        account.setUpdatedAt(LocalDateTime.now());

        accountRepository.save(account);
    }

    private void revertAccountBalance(String userId, Long accountId, BigDecimal amount, String type) {
        // Para reverter, fazemos o oposto do update
        AccountEntity account = accountRepository.findByIdAndUserId(accountId, userId)
                .orElseThrow(() -> new RuntimeException("Conta vinculada não encontrada"));

        // Se era income, subtraímos. Se era expense, somamos.
        BigDecimal reversal = "income".equals(type) ? amount.negate() : amount;
        account.setBalance(account.getBalance().add(reversal));
        account.setUpdatedAt(LocalDateTime.now());

        accountRepository.save(account);
    }

    // --- Mappers ---
    private AccountDTO toAccountDTO(AccountEntity e) {
        return AccountDTO.builder()
                .id(e.getId()).name(e.getName()).type(e.getType())
                .balance(e.getBalance()).bank(e.getBank()).build();
    }

    private TransactionDTO toTransactionDTO(TransactionEntity e) {
        return TransactionDTO.builder()
                .id(e.getId()).accountId(e.getAccountId()).description(e.getDescription())
                .amount(e.getAmount()).type(e.getType()).category(e.getCategory())
                .date(e.getDate()).build();
    }
}