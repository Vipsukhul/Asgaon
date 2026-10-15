package com.digitalgaon.repository;

import com.digitalgaon.model.Scholarship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ScholarshipRepository extends JpaRepository<Scholarship, UUID> {
}
