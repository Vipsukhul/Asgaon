package com.digitalgaon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
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
    private BigDecimal rating = new BigDecimal("5.0");

    public BusinessRequest() {}

    @Builder
    public BusinessRequest(String name, String category, String description, String address, String landmark,
                           String phone, String whatsapp, String openingHours, String imageUrl,
                           String verificationBadge, BigDecimal latitude, BigDecimal longitude, BigDecimal rating) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.address = address;
        this.landmark = landmark;
        this.phone = phone;
        this.whatsapp = whatsapp;
        this.openingHours = openingHours;
        this.imageUrl = imageUrl;
        this.verificationBadge = verificationBadge;
        this.latitude = latitude;
        this.longitude = longitude;
        this.rating = rating != null ? rating : new BigDecimal("5.0");
    }
}
