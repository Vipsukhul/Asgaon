package com.digitalgaon.repository;

import com.digitalgaon.model.MarketplaceListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MarketplaceListingRepository extends JpaRepository<MarketplaceListing, UUID> {
    List<MarketplaceListing> findByStatusOrderByCreatedAtDesc(String status);
    List<MarketplaceListing> findByCategoryIgnoreCaseAndStatus(String category, String status);
    List<MarketplaceListing> findByContactPhoneAndStatus(String contactPhone, String status);
}
