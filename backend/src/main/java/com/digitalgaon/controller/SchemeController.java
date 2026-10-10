package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.model.Scheme;
import com.digitalgaon.service.SchemeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/schemes")
@Tag(name = "Government Schemes (Yojana)", description = "Central, State, and District government welfare schemes")
public class SchemeController {

    private final SchemeService schemeService;

    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    @GetMapping
    @Operation(summary = "Get all welfare schemes, optionally filtered by category")
    public ResponseEntity<ApiResponse<List<Scheme>>> getSchemes(@RequestParam(required = false) String category) {
        List<Scheme> schemes;
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            schemes = schemeService.getSchemesByCategory(category);
        } else {
            schemes = schemeService.getAllSchemes();
        }
        return ResponseEntity.ok(ApiResponse.ok(schemes));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get scheme details by ID")
    public ResponseEntity<ApiResponse<Scheme>> getSchemeById(@PathVariable UUID id) {
        return schemeService.getSchemeById(id)
                .map(s -> ResponseEntity.ok(ApiResponse.ok(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get scheme details by Slug")
    public ResponseEntity<ApiResponse<Scheme>> getSchemeBySlug(@PathVariable String slug) {
        return schemeService.getSchemeBySlug(slug)
                .map(s -> ResponseEntity.ok(ApiResponse.ok(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Add a new welfare scheme (Admin)")
    public ResponseEntity<ApiResponse<Scheme>> createScheme(@RequestBody Scheme scheme) {
        Scheme created = schemeService.createScheme(scheme);
        return ResponseEntity.ok(ApiResponse.ok("Scheme created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing welfare scheme (Admin)")
    public ResponseEntity<ApiResponse<Scheme>> updateScheme(@PathVariable UUID id, @RequestBody Scheme scheme) {
        Scheme updated = schemeService.updateScheme(id, scheme);
        return ResponseEntity.ok(ApiResponse.ok("Scheme updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a welfare scheme (Admin)")
    public ResponseEntity<ApiResponse<Void>> deleteScheme(@PathVariable UUID id) {
        schemeService.deleteScheme(id);
        return ResponseEntity.ok(ApiResponse.ok("Scheme deleted successfully", null));
    }
}
