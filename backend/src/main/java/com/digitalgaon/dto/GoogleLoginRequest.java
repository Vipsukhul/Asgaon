package com.digitalgaon.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class GoogleLoginRequest {
    private String idToken;
    private String email;
    private String fullName;
    private String picture;
    private String role;

    public GoogleLoginRequest() {}

    @Builder
    public GoogleLoginRequest(String idToken, String email, String fullName, String picture, String role) {
        this.idToken = idToken;
        this.email = email;
        this.fullName = fullName;
        this.picture = picture;
        this.role = role;
    }
}
