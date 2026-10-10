package com.digitalgaon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
