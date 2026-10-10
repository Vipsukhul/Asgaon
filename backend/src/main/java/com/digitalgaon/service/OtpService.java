package com.digitalgaon.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private final Map<String, OtpRecord> otpStore = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    public static class OtpRecord {
        private final String otp;
        private final Instant createdAt;
        private final Instant expiresAt;
        private final Instant cooldownUntil;
        private int attempts;

        public OtpRecord(String otp, Instant createdAt, Instant expiresAt, Instant cooldownUntil) {
            this.otp = otp;
            this.createdAt = createdAt;
            this.expiresAt = expiresAt;
            this.cooldownUntil = cooldownUntil;
            this.attempts = 0;
        }

        public String getOtp() { return otp; }
        public Instant getCreatedAt() { return createdAt; }
        public Instant getExpiresAt() { return expiresAt; }
        public Instant getCooldownUntil() { return cooldownUntil; }
        public int getAttempts() { return attempts; }
        public void incrementAttempts() { this.attempts++; }
    }

    public String generateOtp(String email) {
        String normalized = email.trim().toLowerCase();
        Instant now = Instant.now();

        OtpRecord existing = otpStore.get(normalized);
        if (existing != null && now.isBefore(existing.getCooldownUntil())) {
            long remaining = Duration.between(now, existing.getCooldownUntil()).getSeconds();
            throw new IllegalStateException("Please wait " + Math.max(1, remaining) + " seconds before requesting a new code.");
        }

        // Generate 6 digit OTP
        String otp = String.format("%06d", random.nextInt(1_000_000));
        Instant expiresAt = now.plus(5, ChronoUnit.MINUTES);
        Instant cooldownUntil = now.plus(60, ChronoUnit.SECONDS);

        otpStore.put(normalized, new OtpRecord(otp, now, expiresAt, cooldownUntil));
        log.info("Generated Email OTP for {}: {} (Expires in 5m)", normalized, otp);

        return otp;
    }

    public boolean verifyOtp(String email, String inputOtp) {
        String normalized = email.trim().toLowerCase();
        Instant now = Instant.now();

        OtpRecord record = otpStore.get(normalized);
        if (record == null) {
            throw new IllegalArgumentException("No verification code found for this email. Please click Send Code first.");
        }

        if (now.isAfter(record.getExpiresAt())) {
            otpStore.remove(normalized);
            throw new IllegalArgumentException("Verification code has expired. Please request a new code.");
        }

        if (record.getAttempts() >= 5) {
            otpStore.remove(normalized);
            throw new IllegalArgumentException("Too many invalid attempts. Please request a fresh code.");
        }

        if (!record.getOtp().equals(inputOtp.trim())) {
            record.incrementAttempts();
            throw new IllegalArgumentException("Incorrect verification code. Please check your email and try again.");
        }

        // Success - remove OTP so it cannot be re-used
        otpStore.remove(normalized);
        return true;
    }
}
