package com.digitalgaon.service;

import com.digitalgaon.dto.BlogRequest;
import com.digitalgaon.model.Blog;
import com.digitalgaon.model.BlogComment;
import com.digitalgaon.repository.BlogCommentRepository;
import com.digitalgaon.repository.BlogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BlogService {

    private final BlogRepository blogRepository;
    private final BlogCommentRepository blogCommentRepository;

    public BlogService(BlogRepository blogRepository, BlogCommentRepository blogCommentRepository) {
        this.blogRepository = blogRepository;
        this.blogCommentRepository = blogCommentRepository;
    }

    public List<Blog> getAllBlogs(String category) {
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            return blogRepository.findByCategoryIgnoreCaseOrderByCreatedAtDesc(category);
        }
        return blogRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<Blog> getBlogBySlug(String slugOrId) {
        if (slugOrId == null || slugOrId.isBlank()) return Optional.empty();
        String trimmed = slugOrId.trim();

        // 1. Try finding by slug
        Optional<Blog> bySlug = blogRepository.findBySlug(trimmed);
        if (bySlug.isPresent()) return bySlug;

        // 2. Try finding by UUID if it parses
        try {
            UUID id = UUID.fromString(trimmed);
            return blogRepository.findById(id);
        } catch (IllegalArgumentException ignored) {
            // Not a UUID format
        }

        // 3. Fallback: check case-insensitive match on slug
        return blogRepository.findAll().stream()
                .filter(b -> b.getSlug().equalsIgnoreCase(trimmed) || b.getId().toString().startsWith(trimmed))
                .findFirst();
    }

    @Transactional
    public Blog createBlog(BlogRequest req) {
        Blog blog = new Blog();

        String rawSlug = (req.getSlug() != null && !req.getSlug().isBlank())
                ? req.getSlug()
                : (req.getTitle() != null ? req.getTitle() : "blog-" + System.currentTimeMillis());

        String slug = rawSlug.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        if (slug.isBlank()) slug = "blog-" + System.currentTimeMillis();

        // Ensure uniqueness
        if (blogRepository.existsBySlug(slug)) {
            slug = slug + "-" + (System.currentTimeMillis() % 10000);
        }
        blog.setSlug(slug);

        blog.setTitle(req.getTitle());
        blog.setTitleMarathi(req.getTitleMarathi() != null && !req.getTitleMarathi().isBlank() ? req.getTitleMarathi() : req.getTitle());
        blog.setExcerpt(req.getExcerpt());
        blog.setExcerptMarathi(req.getExcerptMarathi() != null ? req.getExcerptMarathi() : req.getExcerpt());
        blog.setContent(req.getContent());
        blog.setContentMarathi(req.getContentMarathi() != null ? req.getContentMarathi() : req.getContent());
        blog.setCategory(req.getCategory() != null && !req.getCategory().isBlank() ? req.getCategory() : "General");
        blog.setCategoryMarathi(req.getCategoryMarathi() != null ? req.getCategoryMarathi() : "सामान्य / इतर");
        blog.setAuthor(req.getAuthor() != null && !req.getAuthor().isBlank() ? req.getAuthor() : "आसगाव ग्रामस्थ");
        blog.setAuthorRole(req.getAuthorRole() != null ? req.getAuthorRole() : "Citizen Contributor");
        blog.setAuthorRoleMarathi(req.getAuthorRoleMarathi() != null ? req.getAuthorRoleMarathi() : "स्थानिक नागरिक");

        OffsetDateTime now = OffsetDateTime.now();
        blog.setPublishDate(req.getPublishDate() != null ? req.getPublishDate() : now.getDayOfMonth() + " " + now.getMonth() + " " + now.getYear());
        blog.setPublishDateISO(req.getPublishDateISO() != null ? req.getPublishDateISO() : now.toLocalDate().toString());
        blog.setReadTimeMinutes(req.getReadTimeMinutes() != null && req.getReadTimeMinutes() > 0 ? req.getReadTimeMinutes() : 3);
        blog.setCoverImage(req.getCoverImage() != null && !req.getCoverImage().isBlank()
                ? req.getCoverImage()
                : "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80");
        blog.setTags(req.getTags());
        blog.setTagsMarathi(req.getTagsMarathi() != null ? req.getTagsMarathi() : req.getTags());
        blog.setSeoTitle(req.getSeoTitle() != null ? req.getSeoTitle() : blog.getTitleMarathi() + " | Asgaon Portal");
        blog.setSeoDescription(req.getSeoDescription() != null ? req.getSeoDescription() : blog.getExcerptMarathi());
        blog.setSeoKeywords(req.getSeoKeywords() != null ? req.getSeoKeywords() : "Asgaon, Maharashtra, Pauni");
        blog.setIsFeatured(Boolean.TRUE.equals(req.getIsFeatured()));
        blog.setViewCount(1);
        blog.setLikesCount(0);
        blog.setCommentsCount(0);
        blog.setCreatedAt(now);
        blog.setUpdatedAt(now);

        return blogRepository.save(blog);
    }

    @Transactional
    public Blog updateBlog(UUID id, BlogRequest req) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found: " + id));

        if (req.getTitle() != null) blog.setTitle(req.getTitle());
        if (req.getTitleMarathi() != null) blog.setTitleMarathi(req.getTitleMarathi());
        if (req.getExcerpt() != null) blog.setExcerpt(req.getExcerpt());
        if (req.getExcerptMarathi() != null) blog.setExcerptMarathi(req.getExcerptMarathi());
        if (req.getContent() != null) blog.setContent(req.getContent());
        if (req.getContentMarathi() != null) blog.setContentMarathi(req.getContentMarathi());
        if (req.getCategory() != null) blog.setCategory(req.getCategory());
        if (req.getCategoryMarathi() != null) blog.setCategoryMarathi(req.getCategoryMarathi());
        if (req.getAuthor() != null) blog.setAuthor(req.getAuthor());
        if (req.getAuthorRole() != null) blog.setAuthorRole(req.getAuthorRole());
        if (req.getAuthorRoleMarathi() != null) blog.setAuthorRoleMarathi(req.getAuthorRoleMarathi());
        if (req.getCoverImage() != null) blog.setCoverImage(req.getCoverImage());
        if (req.getTags() != null) blog.setTags(req.getTags());
        if (req.getTagsMarathi() != null) blog.setTagsMarathi(req.getTagsMarathi());
        if (req.getSeoTitle() != null) blog.setSeoTitle(req.getSeoTitle());
        if (req.getSeoDescription() != null) blog.setSeoDescription(req.getSeoDescription());
        if (req.getSeoKeywords() != null) blog.setSeoKeywords(req.getSeoKeywords());
        if (req.getIsFeatured() != null) blog.setIsFeatured(req.getIsFeatured());
        blog.setUpdatedAt(OffsetDateTime.now());

        return blogRepository.save(blog);
    }

    @Transactional
    public void deleteBlog(UUID id) {
        blogRepository.deleteById(id);
    }

    @Transactional
    public Blog incrementLikes(String slugOrId) {
        Blog blog = getBlogBySlug(slugOrId)
                .orElseThrow(() -> new RuntimeException("Blog not found: " + slugOrId));
        blog.setLikesCount((blog.getLikesCount() != null ? blog.getLikesCount() : 0) + 1);
        return blogRepository.save(blog);
    }

    @Transactional
    public Blog incrementViews(String slugOrId) {
        Blog blog = getBlogBySlug(slugOrId)
                .orElseThrow(() -> new RuntimeException("Blog not found: " + slugOrId));
        blog.setViewCount((blog.getViewCount() != null ? blog.getViewCount() : 0) + 1);
        return blogRepository.save(blog);
    }

    public List<BlogComment> getComments(String blogSlug) {
        return blogCommentRepository.findByBlogSlugOrderByCreatedAtDesc(blogSlug);
    }

    @Transactional
    public BlogComment addComment(String blogSlug, BlogComment comment) {
        comment.setBlogSlug(blogSlug);
        comment.setCreatedAt(OffsetDateTime.now());
        BlogComment saved = blogCommentRepository.save(comment);

        getBlogBySlug(blogSlug).ifPresent(b -> {
            b.setCommentsCount((b.getCommentsCount() != null ? b.getCommentsCount() : 0) + 1);
            blogRepository.save(b);
        });

        return saved;
    }
}
