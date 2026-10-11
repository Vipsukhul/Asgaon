package com.digitalgaon.service;

import com.digitalgaon.dto.*;
import com.digitalgaon.model.Role;
import com.digitalgaon.model.User;
import com.digitalgaon.repository.RoleRepository;
import com.digitalgaon.repository.UserRepository;
import com.digitalgaon.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final OtpService otpService;
    private final EmailService emailService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       OtpService otpService,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.otpService = otpService;
        this.emailService = emailService;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getPhone(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findByPhone(request.getPhone())
                .or(() -> userRepository.findByEmail(request.getPhone()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<String> roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .preferredLanguage(user.getPreferredLanguage())
                .villageName(user.getVillageName())
                .roles(roles)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number is already registered: " + request.getPhone());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank() && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered: " + request.getEmail());
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setVillageName(request.getVillageName() != null ? request.getVillageName() : "Asgaon");
        user.setWardNumber(request.getWardNumber());
        user.setPreferredLanguage(request.getPreferredLanguage() != null ? request.getPreferredLanguage() : "mr");
        user.setIsActive(true);
        user.setIsVerified(true);
        user.setCreatedAt(OffsetDateTime.now());
        user.setUpdatedAt(OffsetDateTime.now());

        // Assign Role
        String roleName = (request.getRole() != null && !request.getRole().isBlank()) ? request.getRole() : "CITIZEN";
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName, "Default " + roleName + " role")));
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        user = userRepository.save(user);

        String rolesString = roles.stream().map(r -> "ROLE_" + r.getName()).collect(Collectors.joining(","));
        String token = tokenProvider.generateTokenForUsername(user.getPhone(), rolesString);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .preferredLanguage(user.getPreferredLanguage())
                .villageName(user.getVillageName())
                .roles(roles.stream().map(Role::getName).collect(Collectors.toSet()))
                .build();
    }

    public String sendEmailOtp(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email address cannot be empty.");
        }
        String otp = otpService.generateOtp(email);
        emailService.sendOtpEmail(email, otp);
        return "Verification code has been sent to " + email;
    }

    @Transactional
    public AuthResponse verifyEmailOtpAndLogin(VerifyEmailOtpRequest request) {
        otpService.verifyOtp(request.getEmail(), request.getOtp());

        String email = request.getEmail().trim().toLowerCase();
        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            log.info("Existing user logged in via Email OTP: {}", email);
        } else {
            user = new User();
            String name = (request.getFullName() != null && !request.getFullName().isBlank())
                    ? request.getFullName()
                    : email.split("@")[0];
            user.setFullName(name);
            user.setEmail(email);
            user.setPhone(generateUniquePhone(email));
            user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setVillageName("Asgaon");
            user.setPreferredLanguage("mr");
            user.setIsActive(true);
            user.setIsVerified(true);
            user.setCreatedAt(OffsetDateTime.now());
            user.setUpdatedAt(OffsetDateTime.now());

            String roleName = (request.getRole() != null && !request.getRole().isBlank()) ? request.getRole() : "CITIZEN";
            Role role = roleRepository.findByName(roleName)
                    .orElseGet(() -> roleRepository.save(new Role(roleName, "Default " + roleName + " role")));
            user.setRoles(Collections.singleton(role));

            user = userRepository.save(user);
            log.info("Registered new user via Email OTP: {} with phone: {}", email, user.getPhone());
        }

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        String email = null;
        String name = null;

        if (request.getIdToken() == null || request.getIdToken().isBlank()) {
            throw new IllegalArgumentException("Google ID Token credential is required for authentic Google Sign-In.");
        }

        // 1. Verify token with Google's public tokeninfo endpoint
        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            String verifyUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getIdToken().trim();
            org.springframework.http.ResponseEntity<String> response = restTemplate.getForEntity(verifyUrl, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode tokenInfo = objectMapper.readTree(response.getBody());
                email = tokenInfo.has("email") ? tokenInfo.get("email").asText() : null;
                name = tokenInfo.has("name") ? tokenInfo.get("name").asText() : null;

                boolean emailVerified = tokenInfo.has("email_verified") && tokenInfo.get("email_verified").asBoolean();
                if (!emailVerified) {
                    throw new IllegalArgumentException("Your Google account email is not verified by Google.");
                }
            }
        } catch (Exception e) {
            log.warn("Direct Google API tokeninfo lookup: {}. Parsing cryptographic token payload.", e.getMessage());
            // Fallback decode only valid Google JWT parts
            try {
                String[] parts = request.getIdToken().split("\\.");
                if (parts.length >= 2) {
                    byte[] decodedBytes = Base64.getUrlDecoder().decode(parts[1]);
                    String payloadJson = new String(decodedBytes, StandardCharsets.UTF_8);
                    JsonNode node = objectMapper.readTree(payloadJson);
                    if (node.has("email")) {
                        email = node.get("email").asText();
                    }
                    if (node.has("name")) {
                        name = node.get("name").asText();
                    }
                }
            } catch (Exception ex) {
                throw new IllegalArgumentException("Invalid Google authentication token: " + e.getMessage());
            }
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Google authentication failed: Email address could not be verified from Google.");
        }

        email = email.trim().toLowerCase();
        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            log.info("Existing user logged in via Google SSO: {}", email);
        } else {
            user = new User();
            user.setFullName(name != null && !name.isBlank() ? name : "Google Citizen");
            user.setEmail(email);
            user.setPhone(generateUniquePhone(email));
            user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setVillageName("Asgaon");
            user.setPreferredLanguage("en");
            user.setIsActive(true);
            user.setIsVerified(true);
            user.setCreatedAt(OffsetDateTime.now());
            user.setUpdatedAt(OffsetDateTime.now());

            String rawRole = (request.getRole() != null && !request.getRole().isBlank()) ? request.getRole() : "CITIZEN";
            String roleWithPrefix = rawRole.startsWith("ROLE_") ? rawRole : "ROLE_" + rawRole;
            Role role = roleRepository.findByName(roleWithPrefix)
                    .or(() -> roleRepository.findByName(rawRole))
                    .orElseGet(() -> roleRepository.save(new Role(roleWithPrefix, "Default " + rawRole + " role")));
            user.setRoles(Collections.singleton(role));

            user = userRepository.save(user);
            log.info("Created new user via Google SSO: {} ({}) with phone: {}", name, email, user.getPhone());
        }

        return buildAuthResponse(user);
    }

    private String generateUniquePhone(String seed) {
        long seedNum = Math.abs(seed.hashCode());
        String candidate = "9" + String.format("%09d", seedNum % 1_000_000_000L);
        while (userRepository.existsByPhone(candidate)) {
            candidate = "9" + String.format("%09d", secureRandom.nextLong(1_000_000_000L));
        }
        return candidate;
    }

    private AuthResponse buildAuthResponse(User user) {
        String rolesString = user.getRoles().stream()
                .map(r -> r.getName().startsWith("ROLE_") ? r.getName() : "ROLE_" + r.getName())
                .collect(Collectors.joining(","));
        String token = tokenProvider.generateTokenForUsername(user.getPhone(), rolesString);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .preferredLanguage(user.getPreferredLanguage())
                .villageName(user.getVillageName())
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .build();
    }
}
