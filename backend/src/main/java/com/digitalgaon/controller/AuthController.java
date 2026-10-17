package com.digitalgaon.controller;

import com.digitalgaon.dto.*;
import com.digitalgaon.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Endpoints for login, register, email OTP, and Google OAuth SSO")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Login with phone/email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/register")
    @Operation(summary = "Register citizen or business owner account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(ApiResponse.ok("Registration successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/email/send-otp")
    @Operation(summary = "Send 6-digit OTP verification code to citizen email")
    public ResponseEntity<ApiResponse<String>> sendEmailOtp(@Valid @RequestBody EmailOtpRequest request) {
        try {
            String msg = authService.sendEmailOtp(request.getEmail());
            return ResponseEntity.ok(ApiResponse.ok(msg, "OTP_SENT"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/email/resend-otp")
    @Operation(summary = "Resend 6-digit OTP code to email respecting cooldown period")
    public ResponseEntity<ApiResponse<String>> resendEmailOtp(@Valid @RequestBody EmailOtpRequest request) {
        try {
            String msg = authService.sendEmailOtp(request.getEmail());
            return ResponseEntity.ok(ApiResponse.ok(msg, "OTP_RESENT"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/email/verify-otp")
    @Operation(summary = "Verify email OTP code and sign in or create citizen account")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyEmailOtp(@Valid @RequestBody VerifyEmailOtpRequest request) {
        try {
            AuthResponse response = authService.verifyEmailOtpAndLogin(request);
            return ResponseEntity.ok(ApiResponse.ok("Email verified successfully. Welcome to Asgaon!", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/google")
    @Operation(summary = "Authenticate citizen via Google OAuth2 / Gmail Single Sign-On")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(@RequestBody GoogleLoginRequest request) {
        try {
            AuthResponse response = authService.googleLogin(request);
            return ResponseEntity.ok(ApiResponse.ok("Signed in with Google successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change or set user account password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            org.springframework.security.core.Authentication authentication) {
        try {
            String authenticatedUser = (authentication != null && authentication.isAuthenticated())
                    ? authentication.getName()
                    : null;
            String msg = authService.changePassword(request, authenticatedUser);
            return ResponseEntity.ok(ApiResponse.ok(msg, "PASSWORD_UPDATED"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
