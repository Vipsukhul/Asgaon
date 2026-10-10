package com.digitalgaon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Please enter a valid 10-digit Indian phone number")
    private String phone;

    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @Builder.Default
    private String preferredLanguage = "mr";
    @Builder.Default
    private String villageName = "Asgaon";
    private String wardNumber;
    @Builder.Default
    private String role = "CITIZEN";
}
