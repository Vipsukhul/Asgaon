package com.digitalgaon.dto;

import java.util.Set;
import java.util.UUID;

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
    private String allowedModules;

    public AuthResponse() {}

    public AuthResponse(String token, String tokenType, UUID userId, String fullName, String phone, String email, String preferredLanguage, String villageName, Set<String> roles, String allowedModules) {
        this.token = token;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.userId = userId;
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.preferredLanguage = preferredLanguage;
        this.villageName = villageName;
        this.roles = roles;
        this.allowedModules = allowedModules;
    }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }

    public String getVillageName() { return villageName; }
    public void setVillageName(String villageName) { this.villageName = villageName; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    public String getAllowedModules() { return allowedModules; }
    public void setAllowedModules(String allowedModules) { this.allowedModules = allowedModules; }

    public static class AuthResponseBuilder {
        private String token;
        private String tokenType = "Bearer";
        private UUID userId;
        private String fullName;
        private String phone;
        private String email;
        private String preferredLanguage;
        private String villageName;
        private Set<String> roles;
        private String allowedModules;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public AuthResponseBuilder userId(UUID userId) { this.userId = userId; return this; }
        public AuthResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public AuthResponseBuilder phone(String phone) { this.phone = phone; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder preferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; return this; }
        public AuthResponseBuilder villageName(String villageName) { this.villageName = villageName; return this; }
        public AuthResponseBuilder roles(Set<String> roles) { this.roles = roles; return this; }
        public AuthResponseBuilder allowedModules(String allowedModules) { this.allowedModules = allowedModules; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, tokenType, userId, fullName, phone, email, preferredLanguage, villageName, roles, allowedModules);
        }
    }
}
