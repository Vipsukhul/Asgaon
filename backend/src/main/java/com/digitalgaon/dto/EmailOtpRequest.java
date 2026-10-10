package com.digitalgaon.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailOtpRequest {
    @NotBlank(message = "Email address is required")
    @Email(message = "Invalid email format")
    private String email;
}
