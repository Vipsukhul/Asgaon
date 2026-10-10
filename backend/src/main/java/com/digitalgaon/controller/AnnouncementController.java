package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.model.Announcement;
import com.digitalgaon.service.AnnouncementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/announcements")
@Tag(name = "Gram Panchayat Announcements", description = "Official circulars, water alerts, Gram Sabha notices, and MSEDCL power rosters")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    @Operation(summary = "Get official announcements and notices")
    public ResponseEntity<ApiResponse<List<Announcement>>> getAnnouncements(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean urgent) {
        
        List<Announcement> announcements;
        if (Boolean.TRUE.equals(urgent)) {
            announcements = announcementService.getHighPriorityAnnouncements();
        } else if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            announcements = announcementService.getAnnouncementsByCategory(category);
        } else {
            announcements = announcementService.getAllAnnouncements();
        }
        return ResponseEntity.ok(ApiResponse.ok(announcements));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get announcement by ID")
    public ResponseEntity<ApiResponse<Announcement>> getAnnouncementById(@PathVariable UUID id) {
        return announcementService.getAnnouncementById(id)
                .map(a -> ResponseEntity.ok(ApiResponse.ok(a)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get announcement by Slug")
    public ResponseEntity<ApiResponse<Announcement>> getAnnouncementBySlug(@PathVariable String slug) {
        return announcementService.getAnnouncementBySlug(slug)
                .map(a -> ResponseEntity.ok(ApiResponse.ok(a)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Publish official Gram Panchayat announcement")
    public ResponseEntity<ApiResponse<Announcement>> createAnnouncement(@RequestBody java.util.Map<String, String> body) {
        String title = body.get("title");
        String category = body.get("category");
        String priority = body.get("priority");
        String message = body.get("message");
        String authorName = body.get("authorName");
        if (title == null || message == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Title and message are required"));
        }
        Announcement a = announcementService.createAnnouncement(title, category, priority, message, authorName);
        return ResponseEntity.ok(ApiResponse.ok("Announcement published successfully", a));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update official announcement or circular (Admin)")
    public ResponseEntity<ApiResponse<Announcement>> updateAnnouncement(
            @PathVariable UUID id,
            @RequestBody java.util.Map<String, Object> body) {
        String title = (String) body.get("title");
        String category = (String) body.get("category");
        String priority = (String) body.get("priority");
        String message = (String) body.get("message");
        String authorName = (String) body.get("authorName");
        Boolean isActive = body.get("isActive") instanceof Boolean ? (Boolean) body.get("isActive") : true;
        Announcement updated = announcementService.updateAnnouncement(id, title, category, priority, message, authorName, isActive);
        return ResponseEntity.ok(ApiResponse.ok("Announcement updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete announcement or circular (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteAnnouncement(@PathVariable UUID id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.ok(ApiResponse.ok("Announcement deleted successfully", null));
    }
}
