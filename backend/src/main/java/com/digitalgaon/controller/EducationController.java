package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.model.School;
import com.digitalgaon.model.Scholarship;
import com.digitalgaon.model.StudyCenter;
import com.digitalgaon.repository.SchoolRepository;
import com.digitalgaon.repository.ScholarshipRepository;
import com.digitalgaon.repository.StudyCenterRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/education")
@Tag(name = "Education & Shiksha Desk", description = "Schools, colleges, scholarships, Abhyasika and coaching center management")
public class EducationController {

    private final SchoolRepository schoolRepository;
    private final ScholarshipRepository scholarshipRepository;
    private final StudyCenterRepository studyCenterRepository;

    public EducationController(SchoolRepository schoolRepository,
                               ScholarshipRepository scholarshipRepository,
                               StudyCenterRepository studyCenterRepository) {
        this.schoolRepository = schoolRepository;
        this.scholarshipRepository = scholarshipRepository;
        this.studyCenterRepository = studyCenterRepository;
    }

    // --- Schools ---
    @GetMapping("/schools")
    @Operation(summary = "Get all schools and colleges")
    public ResponseEntity<ApiResponse<List<School>>> getSchools() {
        return ResponseEntity.ok(ApiResponse.ok(schoolRepository.findAll()));
    }

    @GetMapping("/schools/{id}")
    @Operation(summary = "Get school by ID or slug")
    public ResponseEntity<ApiResponse<School>> getSchoolById(@PathVariable String id) {
        try {
            UUID uuid = UUID.fromString(id);
            return schoolRepository.findById(uuid)
                    .map(s -> ResponseEntity.ok(ApiResponse.ok(s)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            String clean = id.toLowerCase().trim();
            return schoolRepository.findAll().stream()
                    .filter(s -> {
                        String name = s.getName().toLowerCase();
                        String slug = name.replaceAll("[^a-z0-9]+", "-");
                        return slug.equals(clean) || name.contains(clean) || clean.contains(slug);
                    })
                    .findFirst()
                    .map(s -> ResponseEntity.ok(ApiResponse.ok(s)))
                    .orElse(ResponseEntity.notFound().build());
        }
    }

    @PostMapping("/schools")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new school / college (Admin only)")
    public ResponseEntity<ApiResponse<School>> createSchool(@RequestBody School school) {
        School saved = schoolRepository.save(school);
        return ResponseEntity.ok(ApiResponse.ok("School created successfully", saved));
    }

    @PutMapping("/schools/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update school information (Admin only)")
    public ResponseEntity<ApiResponse<School>> updateSchool(@PathVariable String id, @RequestBody School updated) {
        try {
            UUID uuid = UUID.fromString(id);
            return schoolRepository.findById(uuid).map(existing -> {
                existing.setName(updated.getName());
                existing.setBadge(updated.getBadge());
                existing.setCategory(updated.getCategory());
                existing.setGrades(updated.getGrades());
                existing.setMedium(updated.getMedium());
                existing.setDescription(updated.getDescription());
                existing.setTags(updated.getTags());
                existing.setPrincipalName(updated.getPrincipalName());
                existing.setContactPhone(updated.getContactPhone());
                existing.setAddress(updated.getAddress());
                existing.setImageUrl(updated.getImageUrl());
                existing.setLatitude(updated.getLatitude());
                existing.setLongitude(updated.getLongitude());
                School saved = schoolRepository.save(existing);
                return ResponseEntity.ok(ApiResponse.ok("School updated successfully", saved));
            }).orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/schools/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a school (Admin only)")
    public ResponseEntity<ApiResponse<String>> deleteSchool(@PathVariable String id) {
        try {
            UUID uuid = UUID.fromString(id);
            if (!schoolRepository.existsById(uuid)) {
                return ResponseEntity.notFound().build();
            }
            schoolRepository.deleteById(uuid);
            return ResponseEntity.ok(ApiResponse.ok("School deleted successfully", id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // --- Scholarships ---
    @GetMapping("/scholarships")
    @Operation(summary = "Get all scholarships")
    public ResponseEntity<ApiResponse<List<Scholarship>>> getScholarships() {
        return ResponseEntity.ok(ApiResponse.ok(scholarshipRepository.findAll()));
    }

    @PostMapping("/scholarships")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new scholarship (Admin only)")
    public ResponseEntity<ApiResponse<Scholarship>> createScholarship(@RequestBody Scholarship scholarship) {
        Scholarship saved = scholarshipRepository.save(scholarship);
        return ResponseEntity.ok(ApiResponse.ok("Scholarship created successfully", saved));
    }

    @PutMapping("/scholarships/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a scholarship (Admin only)")
    public ResponseEntity<ApiResponse<Scholarship>> updateScholarship(@PathVariable UUID id, @RequestBody Scholarship updated) {
        return scholarshipRepository.findById(id).map(existing -> {
            existing.setTitle(updated.getTitle());
            existing.setBadge(updated.getBadge());
            existing.setDeadline(updated.getDeadline());
            existing.setDescription(updated.getDescription());
            existing.setBenefit(updated.getBenefit());
            existing.setIncomeLimit(updated.getIncomeLimit());
            existing.setDepartment(updated.getDepartment());
            existing.setOfficialUrl(updated.getOfficialUrl());
            existing.setEligibility(updated.getEligibility());
            Scholarship saved = scholarshipRepository.save(existing);
            return ResponseEntity.ok(ApiResponse.ok("Scholarship updated successfully", saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/scholarships/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a scholarship (Admin only)")
    public ResponseEntity<ApiResponse<String>> deleteScholarship(@PathVariable UUID id) {
        if (!scholarshipRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        scholarshipRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Scholarship deleted successfully", id.toString()));
    }

    // --- Study Centers & Tutors ---
    @GetMapping("/study-centers")
    @Operation(summary = "Get all study centers and private tutors")
    public ResponseEntity<ApiResponse<List<StudyCenter>>> getStudyCenters(@RequestParam(required = false) String type) {
        if (type != null && !type.isBlank()) {
            return ResponseEntity.ok(ApiResponse.ok(studyCenterRepository.findByTypeIgnoreCase(type)));
        }
        return ResponseEntity.ok(ApiResponse.ok(studyCenterRepository.findAll()));
    }

    @GetMapping("/study-centers/{id}")
    @Operation(summary = "Get study center by ID or slug")
    public ResponseEntity<ApiResponse<StudyCenter>> getStudyCenterById(@PathVariable String id) {
        try {
            UUID uuid = UUID.fromString(id);
            return studyCenterRepository.findById(uuid)
                    .map(s -> ResponseEntity.ok(ApiResponse.ok(s)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            String clean = id.toLowerCase().trim();
            return studyCenterRepository.findAll().stream()
                    .filter(s -> {
                        String name = s.getName().toLowerCase();
                        String slug = name.replaceAll("[^a-z0-9]+", "-");
                        return slug.equals(clean) || name.contains(clean) || clean.contains(slug);
                    })
                    .findFirst()
                    .map(s -> ResponseEntity.ok(ApiResponse.ok(s)))
                    .orElse(ResponseEntity.notFound().build());
        }
    }

    @PostMapping("/study-centers")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add study center or tutor (Admin only)")
    public ResponseEntity<ApiResponse<StudyCenter>> createStudyCenter(@RequestBody StudyCenter studyCenter) {
        StudyCenter saved = studyCenterRepository.save(studyCenter);
        return ResponseEntity.ok(ApiResponse.ok("Study center created successfully", saved));
    }

    @PutMapping("/study-centers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update study center or tutor (Admin only)")
    public ResponseEntity<ApiResponse<StudyCenter>> updateStudyCenter(@PathVariable String id, @RequestBody StudyCenter updated) {
        try {
            UUID uuid = UUID.fromString(id);
            return studyCenterRepository.findById(uuid).map(existing -> {
                existing.setName(updated.getName());
                existing.setType(updated.getType());
                existing.setCategory(updated.getCategory());
                existing.setSubjects(updated.getSubjects());
                existing.setTiming(updated.getTiming());
                existing.setPhone(updated.getPhone());
                existing.setAddress(updated.getAddress());
                existing.setFeesInfo(updated.getFeesInfo());
                existing.setTotalDesks(updated.getTotalDesks());
                existing.setAvailableDesks(updated.getAvailableDesks());
                existing.setWifiSpeed(updated.getWifiSpeed());
                existing.setBookCount(updated.getBookCount());
                existing.setCaretakerName(updated.getCaretakerName());
                existing.setCaretakerRole(updated.getCaretakerRole());
                existing.setNoticeText(updated.getNoticeText());
                StudyCenter saved = studyCenterRepository.save(existing);
                return ResponseEntity.ok(ApiResponse.ok("Study center updated successfully", saved));
            }).orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/study-centers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete study center or tutor (Admin only)")
    public ResponseEntity<ApiResponse<String>> deleteStudyCenter(@PathVariable String id) {
        try {
            UUID uuid = UUID.fromString(id);
            if (!studyCenterRepository.existsById(uuid)) {
                return ResponseEntity.notFound().build();
            }
            studyCenterRepository.deleteById(uuid);
            return ResponseEntity.ok(ApiResponse.ok("Study center deleted successfully", id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
