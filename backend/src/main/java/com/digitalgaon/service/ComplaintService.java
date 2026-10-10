package com.digitalgaon.service;

import com.digitalgaon.dto.ComplaintRequest;
import com.digitalgaon.model.Complaint;
import com.digitalgaon.repository.ComplaintRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    @Transactional
    public Complaint createComplaint(ComplaintRequest request) {
        Complaint complaint = new Complaint();
        
        // Generate memorable tracking number: ASG-YYYY-XXXXX
        String trackingNumber = String.format("ASG-%d-%05d", 
                Year.now().getValue(), 
                ThreadLocalRandom.current().nextInt(10000, 99999));
        complaint.setTrackingNumber(trackingNumber);
        
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory() != null ? request.getCategory() : "General");
        complaint.setWardOrArea(request.getWard() != null ? request.getWard() : "Village Center");
        complaint.setContactPhone(request.getCitizenPhone() != null ? request.getCitizenPhone() : "Anonymous");
        complaint.setStatus("SUBMITTED");
        complaint.setCreatedAt(OffsetDateTime.now());

        return complaintRepository.save(complaint);
    }

    public Optional<Complaint> trackComplaint(String trackingNumber) {
        return complaintRepository.findByTrackingNumber(trackingNumber.trim().toUpperCase());
    }

    public List<Complaint> getComplaintsByPhone(String phone) {
        return complaintRepository.findByContactPhoneOrderByCreatedAtDesc(phone);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }
}
