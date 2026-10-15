package com.digitalgaon.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "gallery_images")
public class GalleryImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "title_marathi", nullable = false, length = 250)
    private String titleMarathi;

    @Column(name = "title_english", length = 250)
    private String titleEnglish;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "description_marathi", columnDefinition = "TEXT")
    private String descriptionMarathi;

    @Column(name = "description_english", columnDefinition = "TEXT")
    private String descriptionEnglish;

    @Column(length = 150)
    private String location;

    @Column(name = "event_date", length = 100)
    private String eventDate;

    @Column(length = 150)
    private String credit;

    @Column(name = "is_featured")
    private Boolean isFeatured = true;

    @Column(name = "display_order")
    private Integer displayOrder = 1;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public GalleryImage() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getTitleMarathi() { return titleMarathi; }
    public void setTitleMarathi(String titleMarathi) { this.titleMarathi = titleMarathi; }

    public String getTitleEnglish() { return titleEnglish; }
    public void setTitleEnglish(String titleEnglish) { this.titleEnglish = titleEnglish; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescriptionMarathi() { return descriptionMarathi; }
    public void setDescriptionMarathi(String descriptionMarathi) { this.descriptionMarathi = descriptionMarathi; }

    public String getDescriptionEnglish() { return descriptionEnglish; }
    public void setDescriptionEnglish(String descriptionEnglish) { this.descriptionEnglish = descriptionEnglish; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }

    public String getCredit() { return credit; }
    public void setCredit(String credit) { this.credit = credit; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean featured) { isFeatured = featured; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
