package com.digitalgaon.controller;

import com.digitalgaon.dto.AdminStatsDto;
import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.dto.CreateUserAdminRequest;
import com.digitalgaon.dto.UpdateUserAdminRequest;
import com.digitalgaon.dto.UserAdminDto;
import com.digitalgaon.model.Complaint;
import com.digitalgaon.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin Portal", description = "Endpoints for Gram Panchayat Admins and Super Admins")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    @Operation(summary = "Get overall Gram Panchayat civic and commerce metrics")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok("Admin stats loaded", adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all registered citizens and their roles (Super Admin)")
    public ResponseEntity<ApiResponse<List<UserAdminDto>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok("Users loaded", adminService.getAllUsers()));
    }

    @PostMapping("/users")
    @Operation(summary = "Create a new citizen or admin user (Admin/Super Admin)")
    public ResponseEntity<ApiResponse<UserAdminDto>> createUser(@RequestBody CreateUserAdminRequest body) {
        return ResponseEntity.ok(ApiResponse.ok("User created successfully", adminService.createUser(body)));
    }

    @PutMapping("/users/{userId}")
    @Operation(summary = "Update citizen or admin user details (Admin/Super Admin)")
    public ResponseEntity<ApiResponse<UserAdminDto>> updateUser(@PathVariable UUID userId, @RequestBody UpdateUserAdminRequest body) {
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", adminService.updateUser(userId, body)));
    }

    @DeleteMapping("/users/{userId}")
    @Operation(summary = "Delete citizen or admin user (Super Admin)")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable UUID userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", userId.toString()));
    }

    @PatchMapping("/users/{userId}/role")
    @Operation(summary = "Update citizen role (Super Admin)")
    public ResponseEntity<ApiResponse<UserAdminDto>> updateUserRole(@PathVariable UUID userId, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        if (role == null || role.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Role parameter is required"));
        }
        return ResponseEntity.ok(ApiResponse.ok("User role updated successfully", adminService.updateUserRole(userId, role)));
    }

    @PatchMapping("/complaints/{complaintId}/status")
    @Operation(summary = "Update grievance status and add resolution note (Admin/Super Admin)")
    public ResponseEntity<ApiResponse<Complaint>> updateComplaintStatus(
            @PathVariable UUID complaintId,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        String note = body.get("note");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Status is required"));
        }
        return ResponseEntity.ok(ApiResponse.ok("Complaint status updated", adminService.updateComplaintStatus(complaintId, status, note)));
    }

    @PatchMapping("/businesses/{businessId}/verify")
    @Operation(summary = "Toggle business verification status (Admin/Super Admin)")
    public ResponseEntity<ApiResponse<com.digitalgaon.model.Business>> verifyBusiness(
            @PathVariable UUID businessId,
            @RequestBody Map<String, Object> body) {
        Boolean verified = body.containsKey("verified") ? (Boolean) body.get("verified") : true;
        String badge = (String) body.getOrDefault("badge", "Verified Merchant");
        return ResponseEntity.ok(ApiResponse.ok("Business verification updated", adminService.updateBusinessVerification(businessId, verified, badge)));
    }

    @DeleteMapping("/businesses/{businessId}")
    @Operation(summary = "Delete business (Admin/Super Admin)")
    public ResponseEntity<ApiResponse<String>> deleteBusiness(@PathVariable UUID businessId) {
        adminService.deleteBusiness(businessId);
        return ResponseEntity.ok(ApiResponse.ok("Business deleted successfully", businessId.toString()));
    }

    @DeleteMapping("/jobs/{jobId}")
    @Operation(summary = "Delete job (Admin/Super Admin)")
    public ResponseEntity<ApiResponse<String>> deleteJob(@PathVariable UUID jobId) {
        adminService.deleteJob(jobId);
        return ResponseEntity.ok(ApiResponse.ok("Job deleted successfully", jobId.toString()));
    }
}
