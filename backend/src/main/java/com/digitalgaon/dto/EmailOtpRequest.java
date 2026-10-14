package com.digitalgaon.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
public class EmailOtpRequest {
    @NotBlank(message = "Email address is required")
    @Email(message = "Invalid email format")
    private String email;

    public EmailOtpRequest() {}

    @Builder
    public EmailOtpRequest(String email) {
        this.email = email;
    }
}
