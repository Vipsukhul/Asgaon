package com.digitalgaon.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);

    private final Cloudinary cloudinary;
    private final boolean isConfigured;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name:demo}") String cloudName,
            @Value("${cloudinary.api-key:}") String apiKey,
            @Value("${cloudinary.api-secret:}") String apiSecret) {

        if (apiKey != null && !apiKey.isBlank() && apiSecret != null && !apiSecret.isBlank()) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret,
                    "secure", true
            ));
            this.isConfigured = true;
            log.info("Cloudinary Service initialized for cloud: {}", cloudName);
        } else {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "secure", true
            ));
            this.isConfigured = false;
            log.warn("Cloudinary API Key not specified. Running in fallback mode.");
        }
    }

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload empty file");
        }

        String targetFolder = (folder != null && !folder.isBlank()) ? folder : "digitalgaon/asgaon";

        if (isConfigured) {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", targetFolder,
                            "resource_type", "image",
                            "public_id", UUID.randomUUID().toString()
                    )
            );
            return uploadResult.get("secure_url").toString();
        } else {
            // High-fidelity fallback when user hasn't added Cloudinary API secrets yet:
            // Return base64 data URI so images immediately work locally without any external account!
            String contentType = file.getContentType() != null ? file.getContentType() : "image/jpeg";
            String base64 = Base64.getEncoder().encodeToString(file.getBytes());
            log.info("Fallback image encoded ({} bytes)", file.getSize());
            return "data:" + contentType + ";base64," + base64;
        }
    }
}
