package com.digitalgaon.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "blogs")
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "title_marathi", nullable = false, length = 255)
    private String titleMarathi;

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @Column(name = "excerpt_marathi", columnDefinition = "TEXT")
    private String excerptMarathi;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "content_marathi", columnDefinition = "TEXT")
    private String contentMarathi;

    @Column(nullable = false, length = 50)
    private String category = "General";

    @Column(name = "category_marathi", length = 100)
    private String categoryMarathi = "सामान्य / इतर";

    @Column(nullable = false, length = 150)
    private String author = "आसगाव ग्रामस्थ";

    @Column(name = "author_role", length = 150)
    private String authorRole = "Citizen Contributor";

    @Column(name = "author_role_marathi", length = 150)
    private String authorRoleMarathi = "स्थानिक नागरिक";

    @Column(name = "publish_date", length = 100)
    private String publishDate;

    @Column(name = "publish_date_iso", length = 50)
    private String publishDateISO;

    @Column(name = "read_time_minutes")
    private Integer readTimeMinutes = 3;

    @Column(name = "cover_image", length = 500)
    private String coverImage;

    @Column(columnDefinition = "TEXT")
    private String tags;

    @Column(name = "tags_marathi", columnDefinition = "TEXT")
    private String tagsMarathi;

    @Column(name = "seo_title", length = 255)
    private String seoTitle;

    @Column(name = "seo_description", columnDefinition = "TEXT")
    private String seoDescription;

    @Column(name = "seo_keywords", length = 255)
    private String seoKeywords;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "likes_count")
    private Integer likesCount = 0;

    @Column(name = "comments_count")
    private Integer commentsCount = 0;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    public Blog() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTitleMarathi() { return titleMarathi; }
    public void setTitleMarathi(String titleMarathi) { this.titleMarathi = titleMarathi; }

    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }

    public String getExcerptMarathi() { return excerptMarathi; }
    public void setExcerptMarathi(String excerptMarathi) { this.excerptMarathi = excerptMarathi; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getContentMarathi() { return contentMarathi; }
    public void setContentMarathi(String contentMarathi) { this.contentMarathi = contentMarathi; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCategoryMarathi() { return categoryMarathi; }
    public void setCategoryMarathi(String categoryMarathi) { this.categoryMarathi = categoryMarathi; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }

    public String getAuthorRoleMarathi() { return authorRoleMarathi; }
    public void setAuthorRoleMarathi(String authorRoleMarathi) { this.authorRoleMarathi = authorRoleMarathi; }

    public String getPublishDate() { return publishDate; }
    public void setPublishDate(String publishDate) { this.publishDate = publishDate; }

    public String getPublishDateISO() { return publishDateISO; }
    public void setPublishDateISO(String publishDateISO) { this.publishDateISO = publishDateISO; }

    public Integer getReadTimeMinutes() { return readTimeMinutes; }
    public void setReadTimeMinutes(Integer readTimeMinutes) { this.readTimeMinutes = readTimeMinutes; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getTagsMarathi() { return tagsMarathi; }
    public void setTagsMarathi(String tagsMarathi) { this.tagsMarathi = tagsMarathi; }

    public String getSeoTitle() { return seoTitle; }
    public void setSeoTitle(String seoTitle) { this.seoTitle = seoTitle; }

    public String getSeoDescription() { return seoDescription; }
    public void setSeoDescription(String seoDescription) { this.seoDescription = seoDescription; }

    public String getSeoKeywords() { return seoKeywords; }
    public void setSeoKeywords(String seoKeywords) { this.seoKeywords = seoKeywords; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }

    public Integer getLikesCount() { return likesCount; }
    public void setLikesCount(Integer likesCount) { this.likesCount = likesCount; }

    public Integer getCommentsCount() { return commentsCount; }
    public void setCommentsCount(Integer commentsCount) { this.commentsCount = commentsCount; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
