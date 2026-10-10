package com.digitalgaon.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleLoginRequest {
    private String idToken;
    private String email;
    private String fullName;
    private String picture;
    private String role;
}
