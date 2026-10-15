package com.digitalgaon.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "auto_drivers")
public class AutoDriver {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "name_marathi", length = 150)
    private String nameMarathi;

    @Column(name = "vehicle_number", length = 50)
    private String vehicleNumber;

    @Column(name = "vehicle_type", length = 100)
    private String vehicleType;

    @Column(nullable = false, length = 50)
    private String phone;

    @Column(name = "stand_location", length = 200)
    private String standLocation;

    @Column(name = "stand_location_marathi", length = 200)
    private String standLocationMarathi;

    @Column(name = "primary_route", length = 200)
    private String primaryRoute;

    @Column(name = "primary_route_marathi", length = 200)
    private String primaryRouteMarathi;

    @Column(name = "estimated_fare", length = 100)
    private String estimatedFare;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public AutoDriver() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getNameMarathi() { return nameMarathi; }
    public void setNameMarathi(String nameMarathi) { this.nameMarathi = nameMarathi; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStandLocation() { return standLocation; }
    public void setStandLocation(String standLocation) { this.standLocation = standLocation; }

    public String getStandLocationMarathi() { return standLocationMarathi; }
    public void setStandLocationMarathi(String standLocationMarathi) { this.standLocationMarathi = standLocationMarathi; }

    public String getPrimaryRoute() { return primaryRoute; }
    public void setPrimaryRoute(String primaryRoute) { this.primaryRoute = primaryRoute; }

    public String getPrimaryRouteMarathi() { return primaryRouteMarathi; }
    public void setPrimaryRouteMarathi(String primaryRouteMarathi) { this.primaryRouteMarathi = primaryRouteMarathi; }

    public String getEstimatedFare() { return estimatedFare; }
    public void setEstimatedFare(String estimatedFare) { this.estimatedFare = estimatedFare; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean available) { isAvailable = available; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
