package com.digitalgaon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Please enter a valid 10-digit Indian phone number")
    private String phone;

    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String preferredLanguage = "mr";
    private String villageName = "Asgaon";
    private String wardNumber;
    private String role = "CITIZEN";

    public RegisterRequest() {}

    @Builder
    public RegisterRequest(String fullName, String phone, String email, String password, String preferredLanguage, String villageName, String wardNumber, String role) {
        this.fullName = fullName;
        this.phone = phone;
        this.email = email;
        this.password = password;
        this.preferredLanguage = preferredLanguage != null ? preferredLanguage : "mr";
        this.villageName = villageName != null ? villageName : "Asgaon";
        this.wardNumber = wardNumber;
        this.role = role != null ? role : "CITIZEN";
    }
}
