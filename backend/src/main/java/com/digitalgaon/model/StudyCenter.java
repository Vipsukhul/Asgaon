package com.digitalgaon.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "study_centers")
public class StudyCenter {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 250)
    private String name;

    @Column(nullable = false, length = 50)
    private String type; // 'LIBRARY' or 'TUTOR'

    @Column(length = 100)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String subjects;

    @Column(length = 150)
    private String timing;

    @Column(length = 50)
    private String phone;

    @Column(length = 300)
    private String address;

    @Column(name = "fees_info", length = 150)
    private String feesInfo;

    @Column(name = "total_desks")
    private Integer totalDesks = 40;

    @Column(name = "available_desks")
    private Integer availableDesks = 15;

    @Column(name = "wifi_speed", length = 100)
    private String wifiSpeed;

    @Column(name = "book_count", length = 100)
    private String bookCount;

    @Column(name = "caretaker_name", length = 150)
    private String caretakerName;

    @Column(name = "caretaker_role", length = 150)
    private String caretakerRole;

    @Column(name = "notice_text", columnDefinition = "TEXT")
    private String noticeText;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public StudyCenter() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubjects() { return subjects; }
    public void setSubjects(String subjects) { this.subjects = subjects; }

    public String getTiming() { return timing; }
    public void setTiming(String timing) { this.timing = timing; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getFeesInfo() { return feesInfo; }
    public void setFeesInfo(String feesInfo) { this.feesInfo = feesInfo; }

    public Integer getTotalDesks() { return totalDesks; }
    public void setTotalDesks(Integer totalDesks) { this.totalDesks = totalDesks; }

    public Integer getAvailableDesks() { return availableDesks; }
    public void setAvailableDesks(Integer availableDesks) { this.availableDesks = availableDesks; }

    public String getWifiSpeed() { return wifiSpeed; }
    public void setWifiSpeed(String wifiSpeed) { this.wifiSpeed = wifiSpeed; }

    public String getBookCount() { return bookCount; }
    public void setBookCount(String bookCount) { this.bookCount = bookCount; }

    public String getCaretakerName() { return caretakerName; }
    public void setCaretakerName(String caretakerName) { this.caretakerName = caretakerName; }

    public String getCaretakerRole() { return caretakerRole; }
    public void setCaretakerRole(String caretakerRole) { this.caretakerRole = caretakerRole; }

    public String getNoticeText() { return noticeText; }
    public void setNoticeText(String noticeText) { this.noticeText = noticeText; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
