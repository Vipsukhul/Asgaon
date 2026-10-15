package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.model.HeroBanner;
import com.digitalgaon.repository.HeroBannerRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/banners")
@Tag(name = "Homepage Hero Banners", description = "Hero carousel banners and announcements management")
public class HeroBannerController {

    private final HeroBannerRepository bannerRepository;

    public HeroBannerController(HeroBannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    @GetMapping
    @Operation(summary = "Get active hero banners for homepage")
    public ResponseEntity<ApiResponse<List<HeroBanner>>> getActiveBanners() {
        return ResponseEntity.ok(ApiResponse.ok(bannerRepository.findByIsActiveTrueOrderByDisplayOrderAsc()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all hero banners including inactive (Admin only)")
    public ResponseEntity<ApiResponse<List<HeroBanner>>> getAllBanners() {
        return ResponseEntity.ok(ApiResponse.ok(bannerRepository.findAllByOrderByDisplayOrderAsc()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a hero banner (Admin only)")
    public ResponseEntity<ApiResponse<HeroBanner>> createBanner(@RequestBody HeroBanner banner) {
        HeroBanner saved = bannerRepository.save(banner);
        return ResponseEntity.ok(ApiResponse.ok("Hero banner created successfully", saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a hero banner (Admin only)")
    public ResponseEntity<ApiResponse<HeroBanner>> updateBanner(@PathVariable UUID id, @RequestBody HeroBanner updated) {
        return bannerRepository.findById(id).map(existing -> {
            existing.setSlideType(updated.getSlideType());
            existing.setImageUrl(updated.getImageUrl());
            existing.setShowTextOverlay(updated.getShowTextOverlay());
            existing.setBadgeMarathi(updated.getBadgeMarathi());
            existing.setBadgeEnglish(updated.getBadgeEnglish());
            existing.setTitleMarathi(updated.getTitleMarathi());
            existing.setTitleEnglish(updated.getTitleEnglish());
            existing.setSubtitleMarathi(updated.getSubtitleMarathi());
            existing.setSubtitleEnglish(updated.getSubtitleEnglish());
            existing.setCtaTextMarathi(updated.getCtaTextMarathi());
            existing.setCtaTextEnglish(updated.getCtaTextEnglish());
            existing.setCtaLink(updated.getCtaLink());
            existing.setIsActive(updated.getIsActive());
            existing.setDisplayOrder(updated.getDisplayOrder());
            HeroBanner saved = bannerRepository.save(existing);
            return ResponseEntity.ok(ApiResponse.ok("Hero banner updated successfully", saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a hero banner (Admin only)")
    public ResponseEntity<ApiResponse<String>> deleteBanner(@PathVariable UUID id) {
        if (!bannerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bannerRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Hero banner deleted successfully", id.toString()));
    }
}
