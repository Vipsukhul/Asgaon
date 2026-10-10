package com.digitalgaon.repository;

import com.digitalgaon.model.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchemeRepository extends JpaRepository<Scheme, UUID> {
    List<Scheme> findAllByOrderByCreatedAtDesc();
    List<Scheme> findByCategoryIgnoreCase(String category);
    Optional<Scheme> findBySlug(String slug);
}
