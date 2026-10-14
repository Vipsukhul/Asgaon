package com.digitalgaon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
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

    public MarketplaceListingRequest() {}

    @Builder
    public MarketplaceListingRequest(String titleEn, String titleMr, String category, BigDecimal price,
                                     String unit, String descriptionEn, String descriptionMr, String imageUrl,
                                     String sellerName, String sellerPhone, String villageName, String locationDetail) {
        this.titleEn = titleEn;
        this.titleMr = titleMr;
        this.category = category;
        this.price = price;
        this.unit = unit;
        this.descriptionEn = descriptionEn;
        this.descriptionMr = descriptionMr;
        this.imageUrl = imageUrl;
        this.sellerName = sellerName;
        this.sellerPhone = sellerPhone;
        this.villageName = villageName;
        this.locationDetail = locationDetail;
    }
}
