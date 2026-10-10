package com.digitalgaon.repository;

import com.digitalgaon.model.Business;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BusinessRepository extends JpaRepository<Business, UUID> {
    List<Business> findAllByOrderByRatingDesc();
    List<Business> findByCategory_Slug(String categorySlug);
    List<Business> findByIsVerifiedTrue();
    Optional<Business> findBySlug(String slug);

    @Query("SELECT b FROM Business b WHERE " +
           "LOWER(b.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(b.address) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Business> searchBusinesses(@Param("query") String query);
}
