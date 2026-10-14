package com.digitalgaon.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private UUID userId;
    private String fullName;
    private String phone;
    private String email;
    private String preferredLanguage;
    private String villageName;
    private Set<String> roles;

    public AuthResponse() {}

    @Builder
    public AuthResponse(String token, String tokenType, UUID userId, String fullName, String phone, String email, String preferredLanguage, String villageName, Set<String> roles) {
        this.token = token;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.userId = userId;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.preferredLanguage = preferredLanguage;
        this.villageName = villageName;
        this.roles = roles;
    }
}
