package com.digitalgaon.repository;

import com.digitalgaon.model.BusinessCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessCategoryRepository extends JpaRepository<BusinessCategory, Long> {
    List<BusinessCategory> findAllByOrderByDisplayOrderAsc();
    Optional<BusinessCategory> findBySlug(String slug);
}
