package com.digitalgaon.repository;

import com.digitalgaon.model.WaterSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WaterScheduleRepository extends JpaRepository<WaterSchedule, UUID> {
}
