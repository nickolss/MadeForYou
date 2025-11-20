package com.nickolss.backend.repositories;

import com.nickolss.backend.models.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<AccountEntity, Long> {
    List<AccountEntity> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<AccountEntity> findByIdAndUserId(Long id, String userId);
}