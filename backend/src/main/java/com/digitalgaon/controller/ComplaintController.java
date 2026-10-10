package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.dto.ComplaintRequest;
import com.digitalgaon.model.Complaint;
import com.digitalgaon.service.ComplaintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/complaints")
@Tag(name = "Grievance & Complaints", description = "Gram Panchayat citizen grievance lodging and resolution tracking")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    @Operation(summary = "Lodge a citizen grievance (anonymous or identified)")
    public ResponseEntity<ApiResponse<Complaint>> lodgeComplaint(@Valid @RequestBody ComplaintRequest request) {
        Complaint complaint = complaintService.createComplaint(request);
        return ResponseEntity.ok(ApiResponse.ok("Grievance lodged successfully", complaint));
    }

    @GetMapping("/track/{trackingNumber}")
    @Operation(summary = "Track grievance status by tracking number (e.g. ASG-2024-XXXXX)")
    public ResponseEntity<ApiResponse<Complaint>> trackComplaint(@PathVariable String trackingNumber) {
        return complaintService.trackComplaint(trackingNumber)
                .map(c -> ResponseEntity.ok(ApiResponse.ok("Record found", c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/citizen")
    @Operation(summary = "Get all grievances filed by phone number")
    public ResponseEntity<ApiResponse<List<Complaint>>> getCitizenComplaints(@RequestParam String phone) {
        return ResponseEntity.ok(ApiResponse.ok(complaintService.getComplaintsByPhone(phone)));
    }

    @GetMapping
    @Operation(summary = "Get all grievances (Admin/Staff view)")
    public ResponseEntity<ApiResponse<List<Complaint>>> getAllComplaints() {
        return ResponseEntity.ok(ApiResponse.ok(complaintService.getAllComplaints()));
    }
}
