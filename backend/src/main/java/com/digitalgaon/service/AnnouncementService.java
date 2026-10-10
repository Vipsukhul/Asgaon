package com.digitalgaon.service;

import com.digitalgaon.model.Announcement;
import com.digitalgaon.repository.AnnouncementRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final PushNotificationService pushNotificationService;

    public AnnouncementService(AnnouncementRepository announcementRepository, PushNotificationService pushNotificationService) {
        this.announcementRepository = announcementRepository;
        this.pushNotificationService = pushNotificationService;
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    public List<Announcement> getAnnouncementsByCategory(String category) {
        return announcementRepository.findByCategoryIgnoreCaseAndIsActiveTrue(category);
    }

    public List<Announcement> getHighPriorityAnnouncements() {
        return announcementRepository.findByPriorityIgnoreCaseAndIsActiveTrue("URGENT");
    }

    public Optional<Announcement> getAnnouncementById(UUID id) {
        return announcementRepository.findById(id);
    }

    public Optional<Announcement> getAnnouncementBySlug(String slug) {
        return announcementRepository.findBySlug(slug);
    }

    public Announcement createAnnouncement(String title, String category, String priority, String message, String authorName) {
        Announcement a = new Announcement();
        a.setTitle(title);
        String baseSlug = title.toLowerCase().replaceAll("[^a-z0-9]+", "-");
        if (baseSlug.isBlank()) baseSlug = "announcement";
        a.setSlug(baseSlug + "-" + (System.currentTimeMillis() % 100000));
        a.setCategory(category != null ? category : "Panchayat");
        a.setPriority(priority != null ? priority.toUpperCase() : "NORMAL");
        a.setMessage(message);
        a.setAuthorName(authorName != null ? authorName : "Gram Sevak Office");
        a.setIsActive(true);
        a.setCreatedAt(java.time.OffsetDateTime.now());
        Announcement saved = announcementRepository.save(a);

        // Dispatch background Web Push alert to all registered citizens
        try {
            String snippet = message.length() > 120 ? message.substring(0, 117) + "..." : message;
            pushNotificationService.broadcast("📢 " + title, snippet, "/announcements", category);
        } catch (Exception e) {
            // Non-blocking
        }

        return saved;
    }

    public Announcement updateAnnouncement(UUID id, String title, String category, String priority, String message, String authorName, Boolean isActive) {
        Announcement a = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found with id: " + id));
        if (title != null && !title.isBlank()) a.setTitle(title);
        if (category != null && !category.isBlank()) a.setCategory(category);
        if (priority != null && !priority.isBlank()) a.setPriority(priority.toUpperCase());
        if (message != null && !message.isBlank()) a.setMessage(message);
        if (authorName != null && !authorName.isBlank()) a.setAuthorName(authorName);
        if (isActive != null) a.setIsActive(isActive);
        return announcementRepository.save(a);
    }

    public void deleteAnnouncement(UUID id) {
        announcementRepository.deleteById(id);
    }
}
