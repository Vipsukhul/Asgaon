package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.model.Business;
import com.digitalgaon.model.BusinessCategory;
import com.digitalgaon.service.BusinessService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Businesses & Directory", description = "Local village business directory and categories")
public class BusinessController {

    private final BusinessService businessService;

    public BusinessController(BusinessService businessService) {
        this.businessService = businessService;
    }

    @GetMapping("/businesses")
    @Operation(summary = "Get all active businesses, optionally filtered by category or search query")
    public ResponseEntity<ApiResponse<List<Business>>> getBusinesses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean featured) {
        
        List<Business> businesses;
        if (search != null && !search.isBlank()) {
            businesses = businessService.search(search);
        } else if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            businesses = businessService.getBusinessesByCategory(category);
        } else if (Boolean.TRUE.equals(featured)) {
            businesses = businessService.getFeaturedBusinesses();
        } else {
            businesses = businessService.getAllBusinesses();
        }

        return ResponseEntity.ok(ApiResponse.ok(businesses));
    }

    @GetMapping("/businesses/{id}")
    @Operation(summary = "Get business by UUID")
    public ResponseEntity<ApiResponse<Business>> getBusinessById(@PathVariable UUID id) {
        return businessService.getBusinessById(id)
                .map(b -> ResponseEntity.ok(ApiResponse.ok(b)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/businesses")
    @Operation(summary = "Register a new local business / shop")
    public ResponseEntity<ApiResponse<Business>> registerBusiness(@jakarta.validation.Valid @RequestBody com.digitalgaon.dto.BusinessRequest request) {
        Business created = businessService.createBusiness(request);
        return ResponseEntity.ok(ApiResponse.ok("Business registered successfully", created));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all business categories")
    public ResponseEntity<ApiResponse<List<BusinessCategory>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(businessService.getAllCategories()));
    }
}
