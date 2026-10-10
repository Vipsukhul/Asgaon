package com.digitalgaon.repository;

import com.digitalgaon.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, UUID> {
    List<Announcement> findByIsActiveTrueOrderByCreatedAtDesc();
    List<Announcement> findByCategoryIgnoreCaseAndIsActiveTrue(String category);
    List<Announcement> findByPriorityIgnoreCaseAndIsActiveTrue(String priority);
    Optional<Announcement> findBySlug(String slug);
}
