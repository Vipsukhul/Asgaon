package com.digitalgaon.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "hero_banners")
public class HeroBanner {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "slide_type", length = 50)
    private String slideType = "custom";

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "show_text_overlay")
    private Boolean showTextOverlay = true;

    @Column(name = "badge_marathi", length = 150)
    private String badgeMarathi;

    @Column(name = "badge_english", length = 150)
    private String badgeEnglish;

    @Column(name = "title_marathi", length = 250)
    private String titleMarathi;

    @Column(name = "title_english", length = 250)
    private String titleEnglish;

    @Column(name = "subtitle_marathi", columnDefinition = "TEXT")
    private String subtitleMarathi;

    @Column(name = "subtitle_english", columnDefinition = "TEXT")
    private String subtitleEnglish;

    @Column(name = "cta_text_marathi", length = 100)
    private String ctaTextMarathi;

    @Column(name = "cta_text_english", length = 100)
    private String ctaTextEnglish;

    @Column(name = "cta_link", length = 200)
    private String ctaLink;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "display_order")
    private Integer displayOrder = 1;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public HeroBanner() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSlideType() { return slideType; }
    public void setSlideType(String slideType) { this.slideType = slideType; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getShowTextOverlay() { return showTextOverlay; }
    public void setShowTextOverlay(Boolean showTextOverlay) { this.showTextOverlay = showTextOverlay; }

    public String getBadgeMarathi() { return badgeMarathi; }
    public void setBadgeMarathi(String badgeMarathi) { this.badgeMarathi = badgeMarathi; }

    public String getBadgeEnglish() { return badgeEnglish; }
    public void setBadgeEnglish(String badgeEnglish) { this.badgeEnglish = badgeEnglish; }

    public String getTitleMarathi() { return titleMarathi; }
    public void setTitleMarathi(String titleMarathi) { this.titleMarathi = titleMarathi; }

    public String getTitleEnglish() { return titleEnglish; }
    public void setTitleEnglish(String titleEnglish) { this.titleEnglish = titleEnglish; }

    public String getSubtitleMarathi() { return subtitleMarathi; }
    public void setSubtitleMarathi(String subtitleMarathi) { this.subtitleMarathi = subtitleMarathi; }

    public String getSubtitleEnglish() { return subtitleEnglish; }
    public void setSubtitleEnglish(String subtitleEnglish) { this.subtitleEnglish = subtitleEnglish; }

    public String getCtaTextMarathi() { return ctaTextMarathi; }
    public void setCtaTextMarathi(String ctaTextMarathi) { this.ctaTextMarathi = ctaTextMarathi; }

    public String getCtaTextEnglish() { return ctaTextEnglish; }
    public void setCtaTextEnglish(String ctaTextEnglish) { this.ctaTextEnglish = ctaTextEnglish; }

    public String getCtaLink() { return ctaLink; }
    public void setCtaLink(String ctaLink) { this.ctaLink = ctaLink; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean active) { isActive = active; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
