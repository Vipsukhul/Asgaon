package com.digitalgaon.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "scholarships")
public class Scholarship {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 250)
    private String title;

    @Column(length = 150)
    private String badge;

    @Column(length = 100)
    private String deadline;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 250)
    private String benefit;

    @Column(name = "income_limit", length = 100)
    private String incomeLimit;

    @Column(length = 200)
    private String department;

    @Column(name = "official_url", length = 500)
    private String officialUrl;

    @Column(columnDefinition = "TEXT")
    private String eligibility;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Scholarship() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBenefit() { return benefit; }
    public void setBenefit(String benefit) { this.benefit = benefit; }

    public String getIncomeLimit() { return incomeLimit; }
    public void setIncomeLimit(String incomeLimit) { this.incomeLimit = incomeLimit; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getOfficialUrl() { return officialUrl; }
    public void setOfficialUrl(String officialUrl) { this.officialUrl = officialUrl; }

    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
