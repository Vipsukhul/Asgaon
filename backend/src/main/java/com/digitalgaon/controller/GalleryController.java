package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.model.GalleryImage;
import com.digitalgaon.repository.GalleryImageRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/gallery")
@Tag(name = "Village Gallery", description = "Asgaon photo gallery, festivals, agriculture, and scenic views")
public class GalleryController {

    private final GalleryImageRepository galleryRepository;

    public GalleryController(GalleryImageRepository galleryRepository) {
        this.galleryRepository = galleryRepository;
    }

    @GetMapping
    @Operation(summary = "Get all gallery images, optionally filtered by category")
    public ResponseEntity<ApiResponse<List<GalleryImage>>> getGalleryImages(@RequestParam(required = false) String category) {
        List<GalleryImage> images;
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            images = galleryRepository.findByCategoryIgnoreCaseOrderByDisplayOrderAsc(category);
        } else {
            images = galleryRepository.findAllByOrderByDisplayOrderAsc();
        }
        return ResponseEntity.ok(ApiResponse.ok(images));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a photo to village gallery (Admin only)")
    public ResponseEntity<ApiResponse<GalleryImage>> addPhoto(@RequestBody GalleryImage photo) {
        GalleryImage saved = galleryRepository.save(photo);
        return ResponseEntity.ok(ApiResponse.ok("Photo added to gallery successfully", saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update gallery photo details (Admin only)")
    public ResponseEntity<ApiResponse<GalleryImage>> updatePhoto(@PathVariable UUID id, @RequestBody GalleryImage updated) {
        return galleryRepository.findById(id).map(existing -> {
            existing.setImageUrl(updated.getImageUrl());
            existing.setTitleMarathi(updated.getTitleMarathi());
            existing.setTitleEnglish(updated.getTitleEnglish());
            existing.setCategory(updated.getCategory());
            existing.setDescriptionMarathi(updated.getDescriptionMarathi());
            existing.setDescriptionEnglish(updated.getDescriptionEnglish());
            existing.setLocation(updated.getLocation());
            existing.setEventDate(updated.getEventDate());
            existing.setCredit(updated.getCredit());
            existing.setIsFeatured(updated.getIsFeatured());
            existing.setDisplayOrder(updated.getDisplayOrder());
            GalleryImage saved = galleryRepository.save(existing);
            return ResponseEntity.ok(ApiResponse.ok("Photo updated successfully", saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete photo from gallery (Admin only)")
    public ResponseEntity<ApiResponse<String>> deletePhoto(@PathVariable UUID id) {
        if (!galleryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        galleryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Photo deleted successfully", id.toString()));
    }
}
