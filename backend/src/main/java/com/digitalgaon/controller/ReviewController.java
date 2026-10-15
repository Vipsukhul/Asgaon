package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.model.CitizenReview;
import com.digitalgaon.repository.CitizenReviewRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reviews")
@Tag(name = "Citizen Reviews & Feedback", description = "Public ratings and reviews for local businesses and services")
public class ReviewController {

    private final CitizenReviewRepository reviewRepository;

    public ReviewController(CitizenReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @GetMapping
    @Operation(summary = "Get all citizen reviews")
    public ResponseEntity<ApiResponse<List<CitizenReview>>> getAllReviews() {
        return ResponseEntity.ok(ApiResponse.ok(reviewRepository.findAllByOrderByCreatedAtDesc()));
    }

    @GetMapping("/business/{businessId}")
    @Operation(summary = "Get reviews for a specific business")
    public ResponseEntity<ApiResponse<List<CitizenReview>>> getReviewsByBusiness(@PathVariable String businessId) {
        return ResponseEntity.ok(ApiResponse.ok(reviewRepository.findByBusinessIdOrderByCreatedAtDesc(businessId)));
    }

    @PostMapping
    @Operation(summary = "Submit a citizen review")
    public ResponseEntity<ApiResponse<CitizenReview>> submitReview(@RequestBody CitizenReview review) {
        if (review.getRating() == null || review.getRating() < 1 || review.getRating() > 5) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Rating must be between 1 and 5"));
        }
        if (review.getUserName() == null || review.getUserName().isBlank()) {
            review.setUserName("ग्रामस्थ");
        }
        review.setStatus("APPROVED");
        CitizenReview saved = reviewRepository.save(review);
        return ResponseEntity.ok(ApiResponse.ok("Review submitted successfully", saved));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete review (Admin only)")
    public ResponseEntity<ApiResponse<String>> deleteReview(@PathVariable UUID id) {
        if (!reviewRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        reviewRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Review deleted successfully", id.toString()));
    }
}
