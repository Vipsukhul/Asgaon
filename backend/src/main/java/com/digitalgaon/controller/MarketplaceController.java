package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.dto.MarketplaceListingRequest;
import com.digitalgaon.model.MarketplaceListing;
import com.digitalgaon.service.MarketplaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/marketplace")
@Tag(name = "Village Marketplace", description = "Farmer harvest, livestock, tractor rental, and village Friday Haat trade")
public class MarketplaceController {

    private final MarketplaceService marketplaceService;

    public MarketplaceController(MarketplaceService marketplaceService) {
        this.marketplaceService = marketplaceService;
    }

    @GetMapping("/listings")
    @Operation(summary = "Get active marketplace listings, optionally filtered by category")
    public ResponseEntity<ApiResponse<List<MarketplaceListing>>> getListings(@RequestParam(required = false) String category) {
        List<MarketplaceListing> listings;
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            listings = marketplaceService.getListingsByCategory(category);
        } else {
            listings = marketplaceService.getAllListings();
        }
        return ResponseEntity.ok(ApiResponse.ok(listings));
    }

    @GetMapping("/listings/{id}")
    @Operation(summary = "Get marketplace listing by ID")
    public ResponseEntity<ApiResponse<MarketplaceListing>> getListingById(@PathVariable UUID id) {
        return marketplaceService.getListingById(id)
                .map(l -> ResponseEntity.ok(ApiResponse.ok(l)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/listings")
    @Operation(summary = "Post a new marketplace listing (Produce, livestock, equipment)")
    public ResponseEntity<ApiResponse<MarketplaceListing>> createListing(@Valid @RequestBody MarketplaceListingRequest request) {
        MarketplaceListing created = marketplaceService.createListing(request);
        return ResponseEntity.ok(ApiResponse.ok("Listing posted successfully", created));
    }
}
