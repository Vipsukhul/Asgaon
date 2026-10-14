package com.digitalgaon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
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

    public ComplaintRequest() {}

    @Builder
    public ComplaintRequest(String citizenName, String citizenPhone, String category, String ward, String title, String description, boolean isAnonymous, String priority, List<String> attachments) {
        this.citizenName = citizenName;
        this.citizenPhone = citizenPhone;
        this.category = category;
        this.ward = ward;
        this.title = title;
        this.description = description;
        this.isAnonymous = isAnonymous;
        this.priority = priority;
        this.attachments = attachments;
    }
}
