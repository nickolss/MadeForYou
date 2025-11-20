package com.nickolss.backend.repositories;

import com.nickolss.backend.models.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {

    // Filtro opcional por accountId
    @Query("SELECT t FROM TransactionEntity t WHERE t.userId = :userId " +
            "AND (:accountId IS NULL OR t.accountId = :accountId) " +
            "ORDER BY t.date DESC")
    List<TransactionEntity> findTransactions(
            @Param("userId") String userId,
            @Param("accountId") Long accountId
    );

    Optional<TransactionEntity> findByIdAndUserId(Long id, String userId);
}