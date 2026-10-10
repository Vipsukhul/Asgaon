package com.digitalgaon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private UUID userId;
    private String fullName;
    private String phone;
    private String email;
    private String preferredLanguage;
    private String villageName;
    private Set<String> roles;
}
