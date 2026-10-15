package com.digitalgaon.repository;

import com.digitalgaon.model.StudyCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudyCenterRepository extends JpaRepository<StudyCenter, UUID> {
    List<StudyCenter> findByTypeIgnoreCase(String type);
}
