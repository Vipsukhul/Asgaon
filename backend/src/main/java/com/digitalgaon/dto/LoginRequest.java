package com.digitalgaon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Password or OTP is required")
    private String password;

    public LoginRequest() {}

    @Builder
    public LoginRequest(String phone, String password) {
        this.phone = phone;
        this.password = password;
    }
}
