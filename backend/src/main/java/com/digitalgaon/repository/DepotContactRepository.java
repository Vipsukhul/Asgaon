package com.digitalgaon.repository;

import com.digitalgaon.model.DepotContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DepotContactRepository extends JpaRepository<DepotContact, UUID> {
}
