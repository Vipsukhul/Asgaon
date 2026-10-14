package com.digitalgaon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
public class BlogRequest {
    private String id;
    private String slug;
    @NotBlank(message = "Title is required")
    private String title;
    private String titleMarathi;
    private String excerpt;
    private String excerptMarathi;
    @NotBlank(message = "Content is required")
    private String content;
    private String contentMarathi;
    private String category;
    private String categoryMarathi;
    private String author;
    private String authorRole;
    private String authorRoleMarathi;
    private String publishDate;
    private String publishDateISO;
    private Integer readTimeMinutes;
    private String coverImage;
    private String tags;
    private String tagsMarathi;
    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;
    private Boolean isFeatured;

    public BlogRequest() {}

    @Builder
    public BlogRequest(String id, String slug, String title, String titleMarathi, String excerpt, String excerptMarathi,
                       String content, String contentMarathi, String category, String categoryMarathi, String author,
                       String authorRole, String authorRoleMarathi, String publishDate, String publishDateISO,
                       Integer readTimeMinutes, String coverImage, String tags, String tagsMarathi,
                       String seoTitle, String seoDescription, String seoKeywords, Boolean isFeatured) {
        this.id = id;
        this.slug = slug;
        this.title = title;
        this.titleMarathi = titleMarathi;
        this.excerpt = excerpt;
        this.excerptMarathi = excerptMarathi;
        this.content = content;
        this.contentMarathi = contentMarathi;
        this.category = category;
        this.categoryMarathi = categoryMarathi;
        this.author = author;
        this.authorRole = authorRole;
        this.authorRoleMarathi = authorRoleMarathi;
        this.publishDate = publishDate;
        this.publishDateISO = publishDateISO;
        this.readTimeMinutes = readTimeMinutes;
        this.coverImage = coverImage;
        this.tags = tags;
        this.tagsMarathi = tagsMarathi;
        this.seoTitle = seoTitle;
        this.seoDescription = seoDescription;
        this.seoKeywords = seoKeywords;
        this.isFeatured = isFeatured;
    }
}
