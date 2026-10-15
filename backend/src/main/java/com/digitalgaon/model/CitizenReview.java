package com.digitalgaon.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "citizen_reviews")
public class CitizenReview {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "business_id", length = 100)
    private String businessId;

    @Column(name = "business_name", nullable = false, length = 200)
    private String businessName;

    @Column(name = "business_slug", length = 200)
    private String businessSlug;

    @Column(name = "user_name", nullable = false, length = 150)
    private String userName;

    @Column(name = "ward_or_area", length = 150)
    private String wardOrArea;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String comment;

    @Column(name = "verified_citizen")
    private Boolean verifiedCitizen = true;

    @Column(length = 50)
    private String status = "APPROVED";

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public CitizenReview() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getBusinessId() { return businessId; }
    public void setBusinessId(String businessId) { this.businessId = businessId; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getBusinessSlug() { return businessSlug; }
    public void setBusinessSlug(String businessSlug) { this.businessSlug = businessSlug; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getWardOrArea() { return wardOrArea; }
    public void setWardOrArea(String wardOrArea) { this.wardOrArea = wardOrArea; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Boolean getVerifiedCitizen() { return verifiedCitizen; }
    public void setVerifiedCitizen(Boolean verifiedCitizen) { this.verifiedCitizen = verifiedCitizen; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
