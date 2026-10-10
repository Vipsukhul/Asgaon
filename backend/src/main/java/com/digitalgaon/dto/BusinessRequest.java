package com.digitalgaon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessRequest {
    @NotBlank(message = "Business name is required")
    private String name;
    private String category;
    private String description;
    private String address;
    private String landmark;
    @NotBlank(message = "Contact phone is required")
    private String phone;
    private String whatsapp;
    private String openingHours;
    private String imageUrl;
    private String verificationBadge;
    private BigDecimal latitude;
    private BigDecimal longitude;
    @Builder.Default
    private BigDecimal rating = new BigDecimal("5.0");
}
