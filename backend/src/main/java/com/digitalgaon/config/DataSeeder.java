package com.digitalgaon.config;

import com.digitalgaon.model.Role;
import com.digitalgaon.model.User;
import com.digitalgaon.repository.RoleRepository;
import com.digitalgaon.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.digitalgaon.repository.VillageEventRepository eventRepository;

    public DataSeeder(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, com.digitalgaon.repository.VillageEventRepository eventRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.eventRepository = eventRepository;
    }

    @Override
    public void run(String... args) {
        try {
            seedRoles();
            seedSuperAdmin();
            seedAdmin();
            seedEvents();
        } catch (Exception e) {
            log.error("DataSeeder initialization notice: {}", e.getMessage());
        }
    }

    private void seedEvents() {
        if (eventRepository.count() > 0) {
            return;
        }

        com.digitalgaon.model.VillageEvent e1 = new com.digitalgaon.model.VillageEvent();
        e1.setTitle("श्री खंडोबा महाराज वार्षिक यात्रा व महाप्रसाद");
        e1.setCategory("religious");
        e1.setEventDate("15 Nov 2025");
        e1.setEventTime("06:00 AM — 11:30 PM");
        e1.setLocation("खंडोबा मंदिर प्रांगण, आसगाव");
        e1.setOrganizer("आसगाव देवस्थान ट्रस्ट व ग्रामस्थ मंडळ");
        e1.setBadge("वार्षिक उत्सव");
        e1.setDescription("गावातील पारंपारिक अखंड हरिनाम सप्ताह सांगता, पालखी मिरवणूक, महाप्रसाद वाटप व कुस्ती दंगल स्पर्धा. सर्व भाविकांनी उपस्थित राहावे.");
        e1.setImageUrl("https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80");
        eventRepository.save(e1);

        com.digitalgaon.model.VillageEvent e2 = new com.digitalgaon.model.VillageEvent();
        e2.setTitle("मोफत आरोग्य, नेत्र तपासणी व चष्मा वाटप शिबीर");
        e2.setCategory("health");
        e2.setEventDate("20 Nov 2025");
        e2.setEventTime("09:00 AM — 04:00 PM");
        e2.setLocation("प्राथमिक आरोग्य केंद्र (PHC), आसगाव");
        e2.setOrganizer("जिल्हा सामान्य रुग्णालय व ग्रामपंचायत आसगाव");
        e2.setBadge("मोफत आरोग्य सेवा");
        e2.setDescription("तज्ज्ञ डॉक्टरांकडून रक्तदाब, मधुमेह, हृदय व मोतीबिंदू तपासणी. गरजूंना मोफत औषधे व चष्मे वाटप. कृपया आधार कार्ड आणावे.");
        e2.setImageUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80");
        eventRepository.save(e2);

        com.digitalgaon.model.VillageEvent e3 = new com.digitalgaon.model.VillageEvent();
        e3.setTitle("खरीप व रब्बी हंगाम आधुनिक शेती तंत्रज्ञान कार्यशाळा");
        e3.setCategory("agriculture");
        e3.setEventDate("28 Nov 2025");
        e3.setEventTime("10:30 AM — 02:30 PM");
        e3.setLocation("ग्रामपंचायत सभागृह (Samaj Mandir), आसगाव");
        e3.setOrganizer("कृषी विज्ञान केंद्र व कृषी विभाग");
        e3.setBadge("शेतकरी मार्गदर्शन");
        e3.setDescription("ठिबक सिंचन अनुदान, सेंद्रिय खते, माती परीक्षण अहवाल वाटप व ड्रोन फवारणी प्रात्यक्षिक. सर्व शेतकरी बांधवांसाठी अल्पोपहार.");
        e3.setImageUrl("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80");
        eventRepository.save(e3);

        com.digitalgaon.model.VillageEvent e4 = new com.digitalgaon.model.VillageEvent();
        e4.setTitle("आसगाव ग्रामीण अजिंक्यपद कबड्डी व क्रिकेट चषक");
        e4.setCategory("sports");
        e4.setEventDate("05 Dec 2025");
        e4.setEventTime("08:00 AM — 06:00 PM");
        e4.setLocation("जिल्हा परिषद शाळा मैदान, आसगाव");
        e4.setOrganizer("आसगाव युवक क्रीडा मंडळ");
        e4.setBadge("क्रीडा स्पर्धा");
        e4.setDescription("परिसरातील १६ संघांमध्ये भव्य कबड्डी व टेनिस बॉल क्रिकेट सामने. प्रथम पारितोषिक ₹२१,००० व चषक. युवक खेळाडूंना सन्मान.");
        e4.setImageUrl("https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?auto=format&fit=crop&w=600&q=80");
        eventRepository.save(e4);

        log.info(">>> [SEED] 4 Village Events seeded successfully into database.");
    }

    private void seedRoles() {
        createRoleIfMissing("ROLE_SUPER_ADMIN", "Master civic coordinator and super administrator");
        createRoleIfMissing("SUPER_ADMIN", "Super administrator without role prefix");
        createRoleIfMissing("ROLE_ADMIN", "Gram Panchayat administrator and desk officer");
        createRoleIfMissing("ADMIN", "Gram admin without role prefix");
        createRoleIfMissing("ROLE_CITIZEN", "General resident of Asgaon");
        createRoleIfMissing("ROLE_FARMER", "Cultivator with Krishi access");
        createRoleIfMissing("ROLE_STUDENT", "Student and youth");
        createRoleIfMissing("ROLE_BUSINESS_OWNER", "Local merchant and enterprise owner");
    }

    private Role createRoleIfMissing(String name, String desc) {
        return roleRepository.findByName(name).orElseGet(() -> {
            Role r = new Role(name, desc);
            return roleRepository.save(r);
        });
    }

    private void seedSuperAdmin() {
        String phone = "9999999999";
        String email = "superadmin@asgaon.digitalgaon.in";

        // Managed directly in DB
        if (userRepository.findByPhone(phone).isPresent() || userRepository.findByEmail(email).isPresent()) {
            return;
        }

        Role superAdminRole = createRoleIfMissing("ROLE_SUPER_ADMIN", "Master civic coordinator");
        Role adminRole = createRoleIfMissing("ROLE_ADMIN", "Gram Panchayat administrator");

        User superAdmin = new User();
        superAdmin.setFullName("Asgaon Chief Super Admin");
        superAdmin.setPhone(phone);
        superAdmin.setEmail(email);
        superAdmin.setPasswordHash("");
        superAdmin.setVillageName("Asgaon");
        superAdmin.setWardNumber("Gram Sachivalaya");
        superAdmin.setPreferredLanguage("en");
        superAdmin.setIsVerified(true);
        superAdmin.setIsActive(true);
        superAdmin.setUpdatedAt(OffsetDateTime.now());

        Set<Role> roles = new HashSet<>();
        roles.add(superAdminRole);
        roles.add(adminRole);
        superAdmin.setRoles(roles);

        userRepository.save(superAdmin);
    }

    private void seedAdmin() {
        String phone = "9822104500";
        String email = "admin@asgaon.digitalgaon.in";

        // Managed directly in DB
        if (userRepository.findByPhone(phone).isPresent() || userRepository.findByEmail(email).isPresent()) {
            return;
        }

        Role adminRole = createRoleIfMissing("ROLE_ADMIN", "Gram Panchayat administrator");

        User admin = new User();
        admin.setFullName("Gram Sevak S. N. Jadhav");
        admin.setPhone(phone);
        admin.setEmail(email);
        admin.setPasswordHash("");
        admin.setVillageName("Asgaon");
        admin.setWardNumber("Ward 2 (Gaothan)");
        admin.setPreferredLanguage("mr");
        admin.setIsVerified(true);
        admin.setIsActive(true);
        admin.setUpdatedAt(OffsetDateTime.now());

        Set<Role> roles = new HashSet<>();
        roles.add(adminRole);
        admin.setRoles(roles);

        userRepository.save(admin);
    }
}
