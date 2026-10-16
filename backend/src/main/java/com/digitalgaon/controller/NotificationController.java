package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.model.User;
import com.digitalgaon.repository.UserRepository;
import com.digitalgaon.service.EmailService;
import com.digitalgaon.service.PushNotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Push Notifications", description = "Browser Web Push Notifications & Broadcasts")
public class NotificationController {

    private final PushNotificationService pushService;
    private final EmailService emailService;
    private final UserRepository userRepository;

    public NotificationController(PushNotificationService pushService, EmailService emailService, UserRepository userRepository) {
        this.pushService = pushService;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    @GetMapping("/vapid-key")
    @Operation(summary = "Get VAPID public key for browser push subscription")
    public ResponseEntity<ApiResponse<Map<String, String>>> getVapidPublicKey() {
        String key = pushService.getPublicKey();
        return ResponseEntity.ok(ApiResponse.ok("VAPID public key retrieved", Map.of("publicKey", key)));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get notification audience statistics (push subscribers and email recipients)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getNotificationStats() {
        long pushCount = pushService.getSubscriberCount();
        long emailCount = userRepository.count();
        return ResponseEntity.ok(ApiResponse.ok("Notification statistics retrieved", Map.of(
            "pushSubscribers", pushCount,
            "emailRecipients", emailCount
        )));
    }

    @PostMapping("/subscribe")
    @Operation(summary = "Register browser push notification subscription")
    public ResponseEntity<ApiResponse<String>> subscribe(@RequestBody Map<String, String> payload) {
        String endpoint = payload.get("endpoint");
        String p256dhKey = payload.get("p256dh");
        String authKey = payload.get("auth");
        String phone = payload.get("phone");
        String role = payload.get("role");

        if (endpoint == null || p256dhKey == null || authKey == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing endpoint, p256dh or auth key"));
        }

        pushService.subscribe(endpoint, p256dhKey, authKey, phone, role);
        return ResponseEntity.ok(ApiResponse.ok("Subscribed to Asgaon Civic Notifications successfully", endpoint));
    }

    @PostMapping("/unsubscribe")
    @Operation(summary = "Unsubscribe device from push notifications")
    public ResponseEntity<ApiResponse<String>> unsubscribe(@RequestBody Map<String, String> payload) {
        String endpoint = payload.get("endpoint");
        if (endpoint != null) {
            pushService.unsubscribe(endpoint);
        }
        return ResponseEntity.ok(ApiResponse.ok("Device unsubscribed successfully", endpoint));
    }

    @PostMapping("/broadcast")
    @Operation(summary = "Broadcast push alert to all registered village subscribers (Admin)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> broadcast(@RequestBody Map<String, Object> payload) {
        String title = (String) payload.getOrDefault("title", "आसगाव ग्रामपंचायत थेट सूचना");
        String message = (String) payload.getOrDefault("message", "नवीन अधिकृत परिपत्रक प्रसिद्ध झाले आहे.");
        String url = (String) payload.getOrDefault("url", "/");
        String category = (String) payload.getOrDefault("category", "all");
        String imageUrl = (String) payload.getOrDefault("imageUrl", "");

        int pushSent = pushService.broadcast(title, message, url, category, imageUrl);
        int emailSent = 0;

        boolean sendEmail = Boolean.TRUE.equals(payload.get("sendEmail")) || "true".equalsIgnoreCase(String.valueOf(payload.get("sendEmail")));
        if (sendEmail) {
            List<String> recipients = new ArrayList<>();
            Object explicitRecipients = payload.get("recipients");
            if (explicitRecipients instanceof List<?> list) {
                for (Object item : list) {
                    if (item != null) recipients.add(item.toString());
                }
            } else {
                recipients = userRepository.findAll().stream()
                    .map(User::getEmail)
                    .filter(Objects::nonNull)
                    .filter(e -> !e.isBlank() && e.contains("@"))
                    .distinct()
                    .collect(Collectors.toList());
            }

            String emailSubject = (String) payload.getOrDefault("emailSubject", title);
            emailSent = emailService.sendBroadcastEmail(emailSubject, message, imageUrl, url, recipients);
        }

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("pushSentCount", pushSent);
        responseData.put("emailSentCount", emailSent);
        responseData.put("totalReached", pushSent + emailSent);

        return ResponseEntity.ok(ApiResponse.ok("Broadcast processed successfully", responseData));
    }

    @PostMapping("/broadcast-email")
    @Operation(summary = "Broadcast standalone email circular to village residents")
    public ResponseEntity<ApiResponse<Map<String, Object>>> broadcastEmail(@RequestBody Map<String, Object> payload) {
        String subject = (String) payload.getOrDefault("subject", "आसगाव ग्रामपंचायत परिपत्रक");
        String body = (String) payload.getOrDefault("body", "");
        String imageUrl = (String) payload.getOrDefault("imageUrl", "");
        String actionUrl = (String) payload.getOrDefault("actionUrl", "/");

        List<String> recipients = new ArrayList<>();
        Object explicitRecipients = payload.get("recipients");
        if (explicitRecipients instanceof List<?> list) {
            for (Object item : list) {
                if (item != null) recipients.add(item.toString());
            }
        } else {
            recipients = userRepository.findAll().stream()
                .map(User::getEmail)
                .filter(Objects::nonNull)
                .filter(e -> !e.isBlank() && e.contains("@"))
                .distinct()
                .collect(Collectors.toList());
        }

        int sent = emailService.sendBroadcastEmail(subject, body, imageUrl, actionUrl, recipients);
        return ResponseEntity.ok(ApiResponse.ok("Email broadcast dispatched", Map.of("sentCount", sent, "recipientsCount", recipients.size())));
    }
}
