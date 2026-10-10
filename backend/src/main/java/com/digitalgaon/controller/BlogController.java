package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.dto.BlogRequest;
import com.digitalgaon.model.Blog;
import com.digitalgaon.model.BlogComment;
import com.digitalgaon.service.BlogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/blogs")
@Tag(name = "Village Blogs & Knowledge Hub", description = "Community and official articles, farming guides, and civic manuals")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    @Operation(summary = "Get all blogs, optionally filtered by category")
    public ResponseEntity<ApiResponse<List<Blog>>> getBlogs(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.ok(blogService.getAllBlogs(category)));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get blog by slug or UUID")
    public ResponseEntity<ApiResponse<Blog>> getBlogBySlug(@PathVariable String slug) {
        return blogService.getBlogBySlug(slug)
                .map(b -> ResponseEntity.ok(ApiResponse.ok(b)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Publish a new blog / article")
    public ResponseEntity<ApiResponse<Blog>> createBlog(@Valid @RequestBody BlogRequest request) {
        Blog created = blogService.createBlog(request);
        return ResponseEntity.ok(ApiResponse.ok("Blog published successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing blog article")
    public ResponseEntity<ApiResponse<Blog>> updateBlog(@PathVariable UUID id, @RequestBody BlogRequest request) {
        Blog updated = blogService.updateBlog(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Blog updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a blog article")
    public ResponseEntity<ApiResponse<String>> deleteBlog(@PathVariable UUID id) {
        blogService.deleteBlog(id);
        return ResponseEntity.ok(ApiResponse.ok("Blog deleted successfully", id.toString()));
    }

    @PostMapping("/{slug}/like")
    @Operation(summary = "Like a blog article")
    public ResponseEntity<ApiResponse<Blog>> likeBlog(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok("Blog liked", blogService.incrementLikes(slug)));
    }

    @PostMapping("/{slug}/view")
    @Operation(summary = "Increment blog view count")
    public ResponseEntity<ApiResponse<Blog>> viewBlog(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok("Blog view counted", blogService.incrementViews(slug)));
    }

    @GetMapping("/{slug}/comments")
    @Operation(summary = "Get comments for a blog")
    public ResponseEntity<ApiResponse<List<BlogComment>>> getComments(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(blogService.getComments(slug)));
    }

    @PostMapping("/{slug}/comments")
    @Operation(summary = "Add a comment to a blog")
    public ResponseEntity<ApiResponse<BlogComment>> addComment(@PathVariable String slug, @RequestBody BlogComment comment) {
        return ResponseEntity.ok(ApiResponse.ok("Comment added successfully", blogService.addComment(slug, comment)));
    }
}
