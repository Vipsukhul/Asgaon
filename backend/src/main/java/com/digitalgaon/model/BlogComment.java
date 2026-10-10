package com.digitalgaon.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "blog_comments")
public class BlogComment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "blog_slug", nullable = false, length = 255)
    private String blogSlug;

    @Column(name = "author_name", nullable = false, length = 150)
    private String authorName;

    @Column(name = "author_role", length = 150)
    private String authorRole;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "timestamp_str", length = 100)
    private String timestampStr;

    @Column(name = "timestamp_iso", length = 100)
    private String timestampIso;

    @Column(name = "likes_count")
    private Integer likesCount = 0;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public BlogComment() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getBlogSlug() { return blogSlug; }
    public void setBlogSlug(String blogSlug) { this.blogSlug = blogSlug; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getTimestampStr() { return timestampStr; }
    public void setTimestampStr(String timestampStr) { this.timestampStr = timestampStr; }

    public String getTimestampIso() { return timestampIso; }
    public void setTimestampIso(String timestampIso) { this.timestampIso = timestampIso; }

    public Integer getLikesCount() { return likesCount; }
    public void setLikesCount(Integer likesCount) { this.likesCount = likesCount; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
