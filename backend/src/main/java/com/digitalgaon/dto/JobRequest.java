package com.digitalgaon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobRequest {
    @NotBlank(message = "Job title is required")
    private String title;
    @NotBlank(message = "Employer name is required")
    private String employerName;
    @NotBlank(message = "Employment type is required")
    private String employmentType;
    private String salaryRange;
    private String location;
    @NotBlank(message = "Description is required")
    private String description;
    private String requirements;
    @NotBlank(message = "Contact phone is required")
    private String contactPhone;
    private LocalDate expiresAt;

    public JobRequest() {}

    @Builder
    public JobRequest(String title, String employerName, String employmentType, String salaryRange, String location, String description, String requirements, String contactPhone, LocalDate expiresAt) {
        this.title = title;
        this.employerName = employerName;
        this.employmentType = employmentType;
        this.salaryRange = salaryRange;
        this.location = location;
        this.description = description;
        this.requirements = requirements;
        this.contactPhone = contactPhone;
        this.expiresAt = expiresAt;
    }
}
