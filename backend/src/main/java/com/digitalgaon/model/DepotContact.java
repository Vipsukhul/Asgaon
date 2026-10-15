package com.digitalgaon.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "depot_contacts")
public class DepotContact {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "depot_name", nullable = false, length = 150)
    private String depotName;

    @Column(name = "depot_name_marathi", length = 150)
    private String depotNameMarathi;

    @Column(nullable = false, length = 50)
    private String phone;

    @Column(name = "controller_desk", length = 50)
    private String controllerDesk;

    @Column(length = 300)
    private String address;

    @Column(name = "address_marathi", length = 300)
    private String addressMarathi;

    @Column(name = "distance_from_asgaon", length = 50)
    private String distanceFromAsgaon;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public DepotContact() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getDepotName() { return depotName; }
    public void setDepotName(String depotName) { this.depotName = depotName; }

    public String getDepotNameMarathi() { return depotNameMarathi; }
    public void setDepotNameMarathi(String depotNameMarathi) { this.depotNameMarathi = depotNameMarathi; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getControllerDesk() { return controllerDesk; }
    public void setControllerDesk(String controllerDesk) { this.controllerDesk = controllerDesk; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getAddressMarathi() { return addressMarathi; }
    public void setAddressMarathi(String addressMarathi) { this.addressMarathi = addressMarathi; }

    public String getDistanceFromAsgaon() { return distanceFromAsgaon; }
    public void setDistanceFromAsgaon(String distanceFromAsgaon) { this.distanceFromAsgaon = distanceFromAsgaon; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
