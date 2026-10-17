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
import com.digitalgaon.dto.CreateUserAdminRequest;
import com.digitalgaon.dto.UpdateUserAdminRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository,
                        RoleRepository roleRepository,
                        ComplaintRepository complaintRepository,
                        BusinessRepository businessRepository,
                        JobRepository jobRepository,
                        AnnouncementRepository announcementRepository,
                        MarketplaceListingRepository marketplaceListingRepository,
                        PushNotificationService pushNotificationService,
                        PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.complaintRepository = complaintRepository;
        this.businessRepository = businessRepository;
        this.jobRepository = jobRepository;
        this.announcementRepository = announcementRepository;
        this.marketplaceListingRepository = marketplaceListingRepository;
        this.pushNotificationService = pushNotificationService;
        this.passwordEncoder = passwordEncoder;
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

    private UserAdminDto toUserAdminDto(User u) {
        return new UserAdminDto(
                u.getId(),
                u.getFullName(),
                u.getPhone(),
                u.getEmail(),
                u.getVillageName(),
                u.getWardNumber(),
                u.getOccupation(),
                u.getIsVerified(),
                u.getIsActive(),
                u.getRoles().stream().map(Role::getName).collect(Collectors.toSet()),
                u.getAllowedModules(),
                u.getCreatedAt()
        );
    }

    public List<UserAdminDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserAdminDto)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public UserAdminDto createUser(CreateUserAdminRequest req) {
        if (req.getPhone() == null || req.getPhone().isBlank()) {
            throw new IllegalArgumentException("मोबाईल नंबर आवश्यक आहे (Phone number is required)");
        }
        String cleanPhone = req.getPhone().trim();
        if (userRepository.existsByPhone(cleanPhone)) {
            throw new IllegalArgumentException("हा मोबाईल नंबर आधीच नोंदणीकृत आहे (Phone number already registered)");
        }
        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            String cleanEmail = req.getEmail().trim();
            if (userRepository.existsByEmail(cleanEmail)) {
                throw new IllegalArgumentException("हा ईमेल आधीच नोंदणीकृत आहे (Email already registered)");
            }
        }

        User user = new User();
        user.setFullName(req.getFullName() != null && !req.getFullName().isBlank() ? req.getFullName().trim() : "ग्रामस्थ नागरिक");
        user.setPhone(cleanPhone);
        user.setEmail(req.getEmail() != null && !req.getEmail().isBlank() ? req.getEmail().trim() : null);

        String rawPassword = (req.getPassword() != null && !req.getPassword().isBlank()) ? req.getPassword().trim() : "Asgaon@123";
        user.setPasswordHash(passwordEncoder.encode(rawPassword));

        user.setVillageName(req.getVillageName() != null && !req.getVillageName().isBlank() ? req.getVillageName().trim() : "Asgaon");
        user.setWardNumber(req.getWardNumber() != null && !req.getWardNumber().isBlank() ? req.getWardNumber().trim() : "वॉर्ड २ (गावठाण)");
        user.setOccupation(req.getOccupation() != null && !req.getOccupation().isBlank() ? req.getOccupation().trim() : "ग्रामस्थ नागरिक");
        user.setIsActive(req.getIsActive() != null ? req.getIsActive() : true);
        user.setIsVerified(req.getIsVerified() != null ? req.getIsVerified() : true);
        user.setCreatedAt(OffsetDateTime.now());
        user.setUpdatedAt(OffsetDateTime.now());

        String targetRole = req.getRole() != null && !req.getRole().isBlank() ? req.getRole().trim().toUpperCase() : "ROLE_CITIZEN";
        if (!targetRole.startsWith("ROLE_")) {
            targetRole = "ROLE_" + targetRole;
        }
        final String roleName = targetRole;
        if (req.getAllowedModules() != null) {
            user.setAllowedModules(req.getAllowedModules().trim());
        } else if (targetRole.contains("ADMIN")) {
            user.setAllowedModules("overview,reviews,notices,water,schemes,complaints,contacts,projects,broadcast");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName, "System assigned " + roleName + " role")));

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        User saved = userRepository.save(user);
        return toUserAdminDto(saved);
    }

    @Transactional
    public UserAdminDto updateUser(UUID userId, UpdateUserAdminRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (req.getFullName() != null && !req.getFullName().isBlank()) {
            user.setFullName(req.getFullName().trim());
        }
        if (req.getPhone() != null && !req.getPhone().isBlank() && !req.getPhone().trim().equals(user.getPhone())) {
            String cleanPhone = req.getPhone().trim();
            if (userRepository.existsByPhone(cleanPhone)) {
                throw new IllegalArgumentException("हा मोबाईल नंबर आधीच नोंदणीकृत आहे");
            }
            user.setPhone(cleanPhone);
        }
        if (req.getEmail() != null) {
            String cleanEmail = req.getEmail().trim();
            if (!cleanEmail.isEmpty() && !cleanEmail.equalsIgnoreCase(user.getEmail())) {
                if (userRepository.existsByEmail(cleanEmail)) {
                    throw new IllegalArgumentException("हा ईमेल आधीच नोंदणीकृत आहे");
                }
                user.setEmail(cleanEmail);
            } else if (cleanEmail.isEmpty()) {
                user.setEmail(null);
            }
        }
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(req.getPassword().trim()));
        }
        if (req.getWardNumber() != null) {
            user.setWardNumber(req.getWardNumber().trim());
        }
        if (req.getOccupation() != null) {
            user.setOccupation(req.getOccupation().trim());
        }
        if (req.getIsActive() != null) {
            user.setIsActive(req.getIsActive());
        }
        if (req.getIsVerified() != null) {
            user.setIsVerified(req.getIsVerified());
        }
        if (req.getAllowedModules() != null) {
            user.setAllowedModules(req.getAllowedModules().trim());
        }
        if (req.getRole() != null && !req.getRole().isBlank()) {
            String targetRole = req.getRole().trim().toUpperCase();
            if (!targetRole.startsWith("ROLE_")) {
                targetRole = "ROLE_" + targetRole;
            }
            final String roleName = targetRole;
            Role role = roleRepository.findByName(roleName)
                    .orElseGet(() -> roleRepository.save(new Role(roleName, "System assigned " + roleName + " role")));
            Set<Role> roles = new HashSet<>();
            roles.add(role);
            user.setRoles(roles);
        }

        user.setUpdatedAt(OffsetDateTime.now());
        User saved = userRepository.save(user);
        return toUserAdminDto(saved);
    }

    @Transactional
    public void deleteUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.getRoles().clear();
        userRepository.delete(user);
    }

    @Transactional
    public UserAdminDto updateUserRole(UUID userId, String newRoleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Enforce canonical role format
        String normalizedRole = newRoleName.trim().toUpperCase();
        if (!normalizedRole.startsWith("ROLE_")) {
            normalizedRole = "ROLE_" + normalizedRole;
        }

        final String targetRole = normalizedRole;
        Role role = roleRepository.findByName(targetRole)
                .orElseGet(() -> roleRepository.save(new Role(targetRole, "System assigned " + targetRole + " role")));

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);
        user.setUpdatedAt(OffsetDateTime.now());
        User saved = userRepository.save(user);

        return toUserAdminDto(saved);
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
