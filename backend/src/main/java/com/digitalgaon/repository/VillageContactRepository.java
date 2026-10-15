package com.digitalgaon.repository;

import com.digitalgaon.model.VillageContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VillageContactRepository extends JpaRepository<VillageContact, UUID> {
    List<VillageContact> findByCategoryIgnoreCase(String category);
}
