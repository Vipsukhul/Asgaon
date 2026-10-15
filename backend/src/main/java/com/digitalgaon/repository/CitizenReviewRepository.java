package com.digitalgaon.repository;

import com.digitalgaon.model.CitizenReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CitizenReviewRepository extends JpaRepository<CitizenReview, UUID> {
    List<CitizenReview> findAllByOrderByCreatedAtDesc();
    List<CitizenReview> findByBusinessIdOrderByCreatedAtDesc(String businessId);
}
