package com.digitalgaon.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "water_schedules")
public class WaterSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String ward;

    @Column(name = "morning_time", nullable = false, length = 100)
    private String morningTime;

    @Column(name = "evening_time", nullable = false, length = 100)
    private String eveningTime;

    @Column(length = 50)
    private String status = "NORMAL";

    @Column(name = "tank_level_percent")
    private Integer tankLevelPercent = 85;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public WaterSchedule() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getMorningTime() { return morningTime; }
    public void setMorningTime(String morningTime) { this.morningTime = morningTime; }

    public String getEveningTime() { return eveningTime; }
    public void setEveningTime(String eveningTime) { this.eveningTime = eveningTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getTankLevelPercent() { return tankLevelPercent; }
    public void setTankLevelPercent(Integer tankLevelPercent) { this.tankLevelPercent = tankLevelPercent; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
