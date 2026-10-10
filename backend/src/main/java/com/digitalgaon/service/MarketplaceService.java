package com.digitalgaon.service;

import com.digitalgaon.dto.MarketplaceListingRequest;
import com.digitalgaon.model.MarketplaceListing;
import com.digitalgaon.repository.MarketplaceListingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MarketplaceService {

    private final MarketplaceListingRepository listingRepository;

    public MarketplaceService(MarketplaceListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    public List<MarketplaceListing> getAllListings() {
        return listingRepository.findByStatusOrderByCreatedAtDesc("ACTIVE");
    }

    public List<MarketplaceListing> getListingsByCategory(String category) {
        return listingRepository.findByCategoryIgnoreCaseAndStatus(category, "ACTIVE");
    }

    public Optional<MarketplaceListing> getListingById(UUID id) {
        return listingRepository.findById(id);
    }

    @Transactional
    public MarketplaceListing createListing(MarketplaceListingRequest request) {
        MarketplaceListing listing = new MarketplaceListing();
        listing.setTitle(request.getTitleEn());
        listing.setCategory(request.getCategory());
        
        String priceFormatted = "₹" + request.getPrice();
        if (request.getUnit() != null && !request.getUnit().isBlank()) {
            priceFormatted += " / " + request.getUnit();
        }
        listing.setPrice(priceFormatted);
        
        listing.setSellerName(request.getSellerName());
        listing.setContactPhone(request.getSellerPhone());
        listing.setVillageLocation(request.getVillageName() != null ? request.getVillageName() : "Asgaon");
        listing.setDescription(request.getDescriptionEn() != null ? request.getDescriptionEn() : "Available in Asgaon");
        listing.setImageUrl(request.getImageUrl());
        listing.setStatus("ACTIVE");
        listing.setCreatedAt(OffsetDateTime.now());

        return listingRepository.save(listing);
    }
}
