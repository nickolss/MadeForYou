package com.nickolss.backend.repositories;

import com.nickolss.backend.models.HabitEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface HabitEntryRepository extends JpaRepository<HabitEntryEntity, Long> {

    @Query("SELECT e FROM HabitEntryEntity e WHERE e.userId = :userId " +
            "AND (:habitId IS NULL OR e.habitId = :habitId) " +
            "AND (cast(:startDate as date) IS NULL OR e.date >= :startDate) " +
            "AND (cast(:endDate as date) IS NULL OR e.date <= :endDate) " +
            "ORDER BY e.date DESC")
    List<HabitEntryEntity> findEntries(
            @Param("userId") String userId,
            @Param("habitId") Long habitId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}