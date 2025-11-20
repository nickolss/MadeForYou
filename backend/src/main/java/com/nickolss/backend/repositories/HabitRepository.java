package com.nickolss.backend.repositories;

import com.nickolss.backend.models.HabitEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HabitRepository extends JpaRepository<HabitEntity, Long> {
    List<HabitEntity> findByUserIdOrderByCreatedAtDesc(String userId);
}