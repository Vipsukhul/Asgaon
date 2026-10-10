package com.digitalgaon.repository;

import com.digitalgaon.model.BlogComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BlogCommentRepository extends JpaRepository<BlogComment, UUID> {
    List<BlogComment> findByBlogSlugOrderByCreatedAtDesc(String blogSlug);
}
