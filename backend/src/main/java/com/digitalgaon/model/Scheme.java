package com.digitalgaon.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "schemes")
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 220)
    private String slug;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "sponsoring_agency", length = 150)
    private String sponsoringAgency;

    @Column(name = "deadline_text", length = 100)
    private String deadlineText;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String benefits;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String eligibility;

    @Column(name = "documents_required", columnDefinition = "TEXT", nullable = false)
    private String documentsRequired;

    @Column(name = "official_url", length = 500)
    private String officialUrl;

    @Column(name = "action_label", length = 100)
    private String actionLabel = "Check Status on Portal";

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Scheme() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSponsoringAgency() { return sponsoringAgency; }
    public void setSponsoringAgency(String sponsoringAgency) { this.sponsoringAgency = sponsoringAgency; }

    public String getDeadlineText() { return deadlineText; }
    public void setDeadlineText(String deadlineText) { this.deadlineText = deadlineText; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBenefits() { return benefits; }
    public void setBenefits(String benefits) { this.benefits = benefits; }

    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }

    public String getDocumentsRequired() { return documentsRequired; }
    public void setDocumentsRequired(String documentsRequired) { this.documentsRequired = documentsRequired; }

    public String getOfficialUrl() { return officialUrl; }
    public void setOfficialUrl(String officialUrl) { this.officialUrl = officialUrl; }

    public String getActionLabel() { return actionLabel; }
    public void setActionLabel(String actionLabel) { this.actionLabel = actionLabel; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
