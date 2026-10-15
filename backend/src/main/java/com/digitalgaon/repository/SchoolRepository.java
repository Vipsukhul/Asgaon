package com.digitalgaon.repository;

import com.digitalgaon.model.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SchoolRepository extends JpaRepository<School, UUID> {
    List<School> findByCategoryIgnoreCase(String category);
}
