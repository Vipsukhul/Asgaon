package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.model.VillageEvent;
import com.digitalgaon.service.VillageEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@Tag(name = "Village Events & Jatra", description = "Asgaon Khandoba Jatra, health camps, Gram Melawa, and cultural festivals")
public class EventController {

    private final VillageEventService eventService;

    public EventController(VillageEventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    @Operation(summary = "Get all village events, optionally filtered by category")
    public ResponseEntity<ApiResponse<List<VillageEvent>>> getEvents(@RequestParam(required = false) String category) {
        List<VillageEvent> events;
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            events = eventService.getEventsByCategory(category);
        } else {
            events = eventService.getAllEvents();
        }
        return ResponseEntity.ok(ApiResponse.ok(events));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get event by ID")
    public ResponseEntity<ApiResponse<VillageEvent>> getEventById(@PathVariable UUID id) {
        return eventService.getEventById(id)
                .map(e -> ResponseEntity.ok(ApiResponse.ok(e)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Submit a community event")
    public ResponseEntity<ApiResponse<VillageEvent>> createEvent(@RequestBody VillageEvent event) {
        VillageEvent saved = eventService.createEvent(event);
        return ResponseEntity.ok(ApiResponse.ok("Event proposal submitted successfully", saved));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing village event")
    public ResponseEntity<ApiResponse<VillageEvent>> updateEvent(@PathVariable UUID id, @RequestBody VillageEvent event) {
        return eventService.updateEvent(id, event)
                .map(updated -> ResponseEntity.ok(ApiResponse.ok("Event updated successfully", updated)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an event")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable UUID id) {
        if (eventService.deleteEvent(id)) {
            return ResponseEntity.ok(ApiResponse.ok("Event deleted successfully", null));
        }
        return ResponseEntity.notFound().build();
    }
}
