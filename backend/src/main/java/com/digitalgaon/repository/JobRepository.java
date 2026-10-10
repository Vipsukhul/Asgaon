package com.digitalgaon.repository;

import com.digitalgaon.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID> {
    List<Job> findByStatusOrderByCreatedAtDesc(String status);
    List<Job> findByEmploymentTypeIgnoreCaseAndStatus(String employmentType, String status);
    Optional<Job> findBySlug(String slug);
}
