package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.model.VillageContact;
import com.digitalgaon.model.WaterSchedule;
import com.digitalgaon.repository.VillageContactRepository;
import com.digitalgaon.repository.WaterScheduleRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/directory")
@Tag(name = "Village Administrative Directory & Utilities", description = "Water schedules and Gram Panchayat contacts")
public class VillageDirectoryController {

    private final WaterScheduleRepository waterScheduleRepository;
    private final VillageContactRepository villageContactRepository;

    public VillageDirectoryController(WaterScheduleRepository waterScheduleRepository,
                                      VillageContactRepository villageContactRepository) {
        this.waterScheduleRepository = waterScheduleRepository;
        this.villageContactRepository = villageContactRepository;
    }

    // --- Water Schedules ---
    @GetMapping("/water-schedules")
    @Operation(summary = "Get all ward water supply schedules")
    public ResponseEntity<ApiResponse<List<WaterSchedule>>> getWaterSchedules() {
        return ResponseEntity.ok(ApiResponse.ok(waterScheduleRepository.findAll()));
    }

    @PutMapping("/water-schedules/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update ward water schedule (Admin only)")
    public ResponseEntity<ApiResponse<WaterSchedule>> updateWaterSchedule(@PathVariable UUID id, @RequestBody WaterSchedule updated) {
        return waterScheduleRepository.findById(id).map(existing -> {
            existing.setWard(updated.getWard());
            existing.setMorningTime(updated.getMorningTime());
            existing.setEveningTime(updated.getEveningTime());
            existing.setStatus(updated.getStatus());
            existing.setTankLevelPercent(updated.getTankLevelPercent());
            existing.setNotes(updated.getNotes());
            WaterSchedule saved = waterScheduleRepository.save(existing);
            return ResponseEntity.ok(ApiResponse.ok("Water schedule updated successfully", saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- Village Contacts ---
    @GetMapping("/contacts")
    @Operation(summary = "Get village administrative and emergency contacts")
    public ResponseEntity<ApiResponse<List<VillageContact>>> getContacts(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(ApiResponse.ok(villageContactRepository.findByCategoryIgnoreCase(category)));
        }
        return ResponseEntity.ok(ApiResponse.ok(villageContactRepository.findAll()));
    }

    @PostMapping("/contacts")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add an administrative contact (Admin only)")
    public ResponseEntity<ApiResponse<VillageContact>> createContact(@RequestBody VillageContact contact) {
        VillageContact saved = villageContactRepository.save(contact);
        return ResponseEntity.ok(ApiResponse.ok("Contact saved successfully", saved));
    }

    @PutMapping("/contacts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update administrative contact (Admin only)")
    public ResponseEntity<ApiResponse<VillageContact>> updateContact(@PathVariable UUID id, @RequestBody VillageContact updated) {
        return villageContactRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setDesignation(updated.getDesignation());
            existing.setPhone(updated.getPhone());
            existing.setCategory(updated.getCategory());
            existing.setOfficeHours(updated.getOfficeHours());
            existing.setAddress(updated.getAddress());
            VillageContact saved = villageContactRepository.save(existing);
            return ResponseEntity.ok(ApiResponse.ok("Contact updated successfully", saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/contacts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete contact (Admin only)")
    public ResponseEntity<ApiResponse<String>> deleteContact(@PathVariable UUID id) {
        if (!villageContactRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        villageContactRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Contact deleted successfully", id.toString()));
    }
}
