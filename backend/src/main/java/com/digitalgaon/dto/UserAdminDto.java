package com.digitalgaon.dto;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

public class UserAdminDto {
    private UUID id;
    private String fullName;
    private String phone;
    private String email;
    private String villageName;
    private String wardNumber;
    private String occupation;
    private Boolean isVerified;
    private Boolean isActive;
    private Set<String> roles;
    private OffsetDateTime createdAt;

    public UserAdminDto() {}

    public UserAdminDto(UUID id, String fullName, String phone, String email, String villageName,
                        String wardNumber, String occupation, Boolean isVerified, Boolean isActive, Set<String> roles, OffsetDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.villageName = villageName;
        this.wardNumber = wardNumber;
        this.occupation = occupation;
        this.isVerified = isVerified;
        this.isActive = isActive;
        this.roles = roles;
        this.createdAt = createdAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getVillageName() { return villageName; }
    public void setVillageName(String villageName) { this.villageName = villageName; }

    public String getWardNumber() { return wardNumber; }
    public void setWardNumber(String wardNumber) { this.wardNumber = wardNumber; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
