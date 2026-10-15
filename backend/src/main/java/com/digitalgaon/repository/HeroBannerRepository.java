package com.digitalgaon.repository;

import com.digitalgaon.model.HeroBanner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HeroBannerRepository extends JpaRepository<HeroBanner, UUID> {
    List<HeroBanner> findByIsActiveTrueOrderByDisplayOrderAsc();
    List<HeroBanner> findAllByOrderByDisplayOrderAsc();
}
