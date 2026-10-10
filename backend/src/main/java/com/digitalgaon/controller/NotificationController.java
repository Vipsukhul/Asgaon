package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.service.PushNotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Push Notifications", description = "Browser Web Push Notifications (Mandi prices, canal rosters, power outages, gazettes)")
public class NotificationController {

    private final PushNotificationService pushService;

    public NotificationController(PushNotificationService pushService) {
        this.pushService = pushService;
    }

    @GetMapping("/vapid-key")
    @Operation(summary = "Get VAPID public key for browser push subscription")
    public ResponseEntity<ApiResponse<Map<String, String>>> getVapidPublicKey() {
        String key = pushService.getPublicKey();
        return ResponseEntity.ok(ApiResponse.ok("VAPID public key retrieved", Map.of("publicKey", key)));
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
    public ResponseEntity<ApiResponse<Map<String, Object>>> broadcast(@RequestBody Map<String, String> payload) {
        String title = payload.getOrDefault("title", "Asgaon Gram Panchayat Notice");
        String message = payload.getOrDefault("message", "New official circular published.");
        String url = payload.getOrDefault("url", "/");
        String category = payload.getOrDefault("category", "all");

        int sent = pushService.broadcast(title, message, url, category);
        return ResponseEntity.ok(ApiResponse.ok("Broadcast processed", Map.of("sentCount", sent)));
    }
}
