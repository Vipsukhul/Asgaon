package com.digitalgaon.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
public class VerifyEmailOtpRequest {
    @NotBlank(message = "Email address is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "OTP code is required")
    private String otp;

    private String role;
    private String fullName;

    public VerifyEmailOtpRequest() {}

    @Builder
    public VerifyEmailOtpRequest(String email, String otp, String role, String fullName) {
        this.email = email;
        this.otp = otp;
        this.role = role;
        this.fullName = fullName;
    }
}
