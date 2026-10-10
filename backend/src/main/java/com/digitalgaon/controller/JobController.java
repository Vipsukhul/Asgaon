package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.model.Job;
import com.digitalgaon.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/jobs")
@Tag(name = "Jobs & Rozgar", description = "Local employment and rozgar opportunities in Asgaon")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    @Operation(summary = "Get active job vacancies, optionally filtered by type")
    public ResponseEntity<ApiResponse<List<Job>>> getJobs(@RequestParam(required = false) String type) {
        List<Job> jobs;
        if (type != null && !type.isBlank() && !type.equalsIgnoreCase("all")) {
            jobs = jobService.getJobsByType(type);
        } else {
            jobs = jobService.getActiveJobs();
        }
        return ResponseEntity.ok(ApiResponse.ok(jobs));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get job details by ID")
    public ResponseEntity<ApiResponse<Job>> getJobById(@PathVariable UUID id) {
        return jobService.getJobById(id)
                .map(j -> ResponseEntity.ok(ApiResponse.ok(j)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get job details by Slug")
    public ResponseEntity<ApiResponse<Job>> getJobBySlug(@PathVariable String slug) {
        return jobService.getJobBySlug(slug)
                .map(j -> ResponseEntity.ok(ApiResponse.ok(j)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Post a new job opening")
    public ResponseEntity<ApiResponse<Job>> createJob(@jakarta.validation.Valid @RequestBody com.digitalgaon.dto.JobRequest request) {
        Job created = jobService.createJob(request);
        return ResponseEntity.ok(ApiResponse.ok("Job vacancy posted successfully", created));
    }
}
