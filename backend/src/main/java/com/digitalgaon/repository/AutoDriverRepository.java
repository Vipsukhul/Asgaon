package com.digitalgaon.repository;

import com.digitalgaon.model.AutoDriver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AutoDriverRepository extends JpaRepository<AutoDriver, UUID> {
}
