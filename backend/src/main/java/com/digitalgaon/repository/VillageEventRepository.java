package com.digitalgaon.repository;

import com.digitalgaon.model.VillageEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VillageEventRepository extends JpaRepository<VillageEvent, UUID> {
    List<VillageEvent> findAllByOrderByCreatedAtDesc();
    List<VillageEvent> findByCategoryIgnoreCase(String category);
}
