package com.digitalgaon.service;

import com.digitalgaon.dto.AdminStatsDto;
import com.digitalgaon.dto.UserAdminDto;
import com.digitalgaon.model.Business;
import com.digitalgaon.model.Complaint;
import com.digitalgaon.model.Role;
import com.digitalgaon.model.User;
import com.digitalgaon.repository.AnnouncementRepository;
import com.digitalgaon.repository.BusinessRepository;
import com.digitalgaon.repository.ComplaintRepository;
import com.digitalgaon.repository.JobRepository;
import com.digitalgaon.repository.MarketplaceListingRepository;
import com.digitalgaon.repository.RoleRepository;
import com.digitalgaon.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ComplaintRepository complaintRepository;
    private final BusinessRepository businessRepository;
    private final JobRepository jobRepository;
    private final AnnouncementRepository announcementRepository;
    private final MarketplaceListingRepository marketplaceListingRepository;
    private final PushNotificationService pushNotificationService;

    public AdminService(UserRepository userRepository,
                        RoleRepository roleRepository,
                        ComplaintRepository complaintRepository,
                        BusinessRepository businessRepository,
                        JobRepository jobRepository,
                        AnnouncementRepository announcementRepository,
                        MarketplaceListingRepository marketplaceListingRepository,
                        PushNotificationService pushNotificationService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.complaintRepository = complaintRepository;
        this.businessRepository = businessRepository;
        this.jobRepository = jobRepository;
        this.announcementRepository = announcementRepository;
        this.marketplaceListingRepository = marketplaceListingRepository;
        this.pushNotificationService = pushNotificationService;
    }

    public AdminStatsDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalComplaints = complaintRepository.count();
        long pendingComplaints = complaintRepository.findAll().stream()
                .filter(c -> "SUBMITTED".equalsIgnoreCase(c.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(c.getStatus()))
                .count();
        long totalBusinesses = businessRepository.count();
        long totalJobs = jobRepository.count();
        long totalAnnouncements = announcementRepository.count();
        long totalMarketplace = marketplaceListingRepository.count();

        return new AdminStatsDto(
                totalUsers,
                totalComplaints,
                pendingComplaints,
                totalBusinesses,
                totalJobs,
                totalAnnouncements,
                totalMarketplace
        );
    }

    public List<UserAdminDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserAdminDto(
                        u.getId(),
                        u.getFullName(),
                        u.getPhone(),
                        u.getEmail(),
                        u.getVillageName(),
                        u.getWardNumber(),
                        u.getIsVerified(),
                        u.getIsActive(),
                        u.getRoles().stream().map(Role::getName).collect(Collectors.toSet()),
                        u.getCreatedAt()
                ))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public UserAdminDto updateUserRole(UUID userId, String newRoleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Role role = roleRepository.findByName(newRoleName)
                .or(() -> roleRepository.findByName("ROLE_" + newRoleName))
                .orElseGet(() -> roleRepository.save(new Role("ROLE_" + newRoleName, "Dynamic " + newRoleName + " role")));

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);
        user.setUpdatedAt(OffsetDateTime.now());
        User saved = userRepository.save(user);

        return new UserAdminDto(
                saved.getId(),
                saved.getFullName(),
                saved.getPhone(),
                saved.getEmail(),
                saved.getVillageName(),
                saved.getWardNumber(),
                saved.getIsVerified(),
                saved.getIsActive(),
                saved.getRoles().stream().map(Role::getName).collect(Collectors.toSet()),
                saved.getCreatedAt()
        );
    }

    @Transactional
    public Complaint updateComplaintStatus(UUID complaintId, String status, String note) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + complaintId));

        complaint.setStatus(status.toUpperCase());
        if (note != null && !note.isBlank()) {
            complaint.setResolutionNote(note);
        }
        if ("RESOLVED".equalsIgnoreCase(status) || "REJECTED".equalsIgnoreCase(status)) {
            complaint.setResolvedAt(OffsetDateTime.now());
        }
        Complaint saved = complaintRepository.save(complaint);

        // Dispatch background Web Push alert to citizens
        try {
            String title = "तक्रार निवारण: " + (complaint.getTitle() != null ? complaint.getTitle() : "नागरी तक्रार") + " (" + status + ")";
            String msg = (note != null && !note.isBlank()) ? note : "ग्रामपंचायत कार्यालयाकडून तक्रार स्थिती '" + status + "' करण्यात आली आहे.";
            pushNotificationService.broadcast(title, msg, "/grievances", "GRIEVANCE");
        } catch (Exception ignored) {}

        return saved;
    }

    @Transactional
    public Business updateBusinessVerification(UUID businessId, boolean verified, String badge) {
        Business biz = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found: " + businessId));
        biz.setIsVerified(verified);
        if (badge != null && !badge.isBlank()) {
            biz.setVerificationBadge(badge);
        }
        return businessRepository.save(biz);
    }

    @Transactional
    public void deleteBusiness(UUID businessId) {
        businessRepository.deleteById(businessId);
    }

    @Transactional
    public void deleteJob(UUID jobId) {
        jobRepository.deleteById(jobId);
    }
}
