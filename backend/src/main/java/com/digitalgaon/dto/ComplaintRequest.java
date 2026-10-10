package com.digitalgaon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintRequest {
    private String citizenName;
    private String citizenPhone;
    private String category;
    private String ward;
    @NotBlank(message = "Title is required")
    private String title;
    @NotBlank(message = "Description is required")
    private String description;
    private boolean isAnonymous;
    private String priority;
    private List<String> attachments;
}
