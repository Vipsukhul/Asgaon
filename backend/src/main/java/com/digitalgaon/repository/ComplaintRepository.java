package com.digitalgaon.repository;

import com.digitalgaon.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, UUID> {
    Optional<Complaint> findByTrackingNumber(String trackingNumber);
    List<Complaint> findByContactPhoneOrderByCreatedAtDesc(String contactPhone);
    List<Complaint> findByStatusOrderByCreatedAtDesc(String status);
    List<Complaint> findAllByOrderByCreatedAtDesc();
}
