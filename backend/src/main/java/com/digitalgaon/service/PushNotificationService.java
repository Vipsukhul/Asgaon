package com.digitalgaon.service;

import com.digitalgaon.model.PushSubscription;
import com.digitalgaon.repository.PushSubscriptionRepository;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Utils;
import org.apache.http.HttpResponse;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.Security;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class PushNotificationService {

    private static final Logger log = LoggerFactory.getLogger(PushNotificationService.class);

    private final PushSubscriptionRepository subscriptionRepository;

    @Value("${vapid.public-key:}")
    private String configuredPublicKey;

    @Value("${vapid.private-key:}")
    private String configuredPrivateKey;

    @Value("${vapid.subject:mailto:admin@asgaon.digitalgaon.in}")
    private String subject;

    private String activePublicKey;
    private String activePrivateKey;
    private PushService pushService;

    public PushNotificationService(PushSubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    @PostConstruct
    public void init() {
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }

        try {
            if (configuredPublicKey != null && !configuredPublicKey.isBlank() &&
                configuredPrivateKey != null && !configuredPrivateKey.isBlank()) {
                this.activePublicKey = configuredPublicKey.trim();
                this.activePrivateKey = configuredPrivateKey.trim();
                log.info("VAPID Keys loaded from configuration.");
            } else {
                java.io.File keyFile = new java.io.File(".vapid_keys");
                if (keyFile.exists()) {
                    java.util.Properties props = new java.util.Properties();
                    try (java.io.FileInputStream fis = new java.io.FileInputStream(keyFile)) {
                        props.load(fis);
                        this.activePublicKey = props.getProperty("publicKey");
                        this.activePrivateKey = props.getProperty("privateKey");
                        log.info("Loaded persistent VAPID keypair from .vapid_keys file.");
                    } catch (Exception ex) {
                        log.warn("Failed reading .vapid_keys, regenerating: {}", ex.getMessage());
                    }
                }

                if (this.activePublicKey == null || this.activePrivateKey == null) {
                    java.security.KeyPairGenerator kpg = java.security.KeyPairGenerator.getInstance("ECDSA", BouncyCastleProvider.PROVIDER_NAME);
                    org.bouncycastle.jce.spec.ECParameterSpec ecSpec = org.bouncycastle.jce.ECNamedCurveTable.getParameterSpec("prime256v1");
                    kpg.initialize(ecSpec);
                    KeyPair keyPair = kpg.generateKeyPair();
                    byte[] pubBytes = Utils.encode((org.bouncycastle.jce.interfaces.ECPublicKey) keyPair.getPublic());
                    byte[] privBytes = Utils.encode((org.bouncycastle.jce.interfaces.ECPrivateKey) keyPair.getPrivate());
                    this.activePublicKey = Base64.getUrlEncoder().withoutPadding().encodeToString(pubBytes);
                    this.activePrivateKey = Base64.getUrlEncoder().withoutPadding().encodeToString(privBytes);

                    try (java.io.FileOutputStream fos = new java.io.FileOutputStream(keyFile)) {
                        java.util.Properties props = new java.util.Properties();
                        props.setProperty("publicKey", this.activePublicKey);
                        props.setProperty("privateKey", this.activePrivateKey);
                        props.store(fos, "Persistent DigitalGaon Asgaon VAPID Keys");
                        log.info("Saved generated VAPID keypair to .vapid_keys file.");
                    } catch (Exception ex) {
                        log.warn("Could not write .vapid_keys file: {}", ex.getMessage());
                    }
                }
            }

            this.pushService = new PushService();
            this.pushService.setPublicKey(Utils.loadPublicKey(this.activePublicKey));
            this.pushService.setPrivateKey(Utils.loadPrivateKey(this.activePrivateKey));
            this.pushService.setSubject(this.subject);
        } catch (Exception e) {
            log.error("Failed to initialize Web Push service: {}", e.getMessage(), e);
        }
    }

    public String getPublicKey() {
        return this.activePublicKey;
    }

    @Transactional
    public PushSubscription subscribe(String endpoint, String p256dhKey, String authKey, String phone, String role) {
        PushSubscription sub = subscriptionRepository.findByEndpoint(endpoint)
                .orElse(new PushSubscription());
        sub.setEndpoint(endpoint);
        sub.setP256dhKey(p256dhKey);
        sub.setAuthKey(authKey);
        if (phone != null && !phone.isBlank()) sub.setUserPhone(phone);
        if (role != null && !role.isBlank()) sub.setUserRole(role);
        sub.setUpdatedAt(OffsetDateTime.now());
        return subscriptionRepository.save(sub);
    }

    @Transactional
    public void unsubscribe(String endpoint) {
        subscriptionRepository.deleteByEndpoint(endpoint);
    }

    public int broadcast(String title, String message, String actionUrl, String category) {
        List<PushSubscription> subscribers = subscriptionRepository.findAll();
        if (subscribers.isEmpty()) {
            log.info("No active web push subscriptions found to broadcast.");
            return 0;
        }

        String jsonPayload = String.format(
            "{\"title\":\"%s\",\"body\":\"%s\",\"url\":\"%s\",\"category\":\"%s\",\"icon\":\"/asgaon-logo.png\",\"badge\":\"/asgaon-logo.png\"}",
            escapeJson(title),
            escapeJson(message),
            escapeJson(actionUrl != null ? actionUrl : "/"),
            escapeJson(category != null ? category : "all")
        );

        int sentCount = 0;
        for (PushSubscription sub : subscribers) {
            try {
                Notification notification = new Notification(
                    sub.getEndpoint(),
                    sub.getP256dhKey(),
                    sub.getAuthKey(),
                    jsonPayload.getBytes(StandardCharsets.UTF_8)
                );

                HttpResponse response = pushService.send(notification);
                int status = response.getStatusLine().getStatusCode();
                if (status == 200 || status == 201) {
                    sentCount++;
                } else if (status == 404 || status == 410) {
                    // Subscription expired or unregistered
                    subscriptionRepository.delete(sub);
                    log.info("Removed expired subscription endpoint: {}", sub.getEndpoint());
                } else {
                    log.warn("Push to {} returned status: {}", sub.getEndpoint(), status);
                }
            } catch (Exception e) {
                log.warn("Push delivery error for endpoint {}: {}", sub.getEndpoint(), e.getMessage());
            }
        }

        log.info("Web Push broadcast sent to {}/{} subscribers: {}", sentCount, subscribers.size(), title);
        return sentCount;
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}
