package com.digitalgaon.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
