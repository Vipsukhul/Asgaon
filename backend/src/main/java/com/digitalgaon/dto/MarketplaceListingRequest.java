package com.digitalgaon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketplaceListingRequest {
    @NotBlank(message = "Title is required")
    private String titleEn;
    private String titleMr;
    @NotBlank(message = "Category is required")
    private String category;
    @NotNull(message = "Price is required")
    private BigDecimal price;
    private String unit;
    private String descriptionEn;
    private String descriptionMr;
    private String imageUrl;
    @NotBlank(message = "Seller name is required")
    private String sellerName;
    @NotBlank(message = "Seller phone is required")
    private String sellerPhone;
    private String villageName;
    private String locationDetail;
}
