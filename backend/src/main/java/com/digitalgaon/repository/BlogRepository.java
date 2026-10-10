package com.digitalgaon.repository;

import com.digitalgaon.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlogRepository extends JpaRepository<Blog, UUID> {
    Optional<Blog> findBySlug(String slug);
    List<Blog> findAllByOrderByCreatedAtDesc();
    List<Blog> findByCategoryIgnoreCaseOrderByCreatedAtDesc(String category);
    boolean existsBySlug(String slug);
}
