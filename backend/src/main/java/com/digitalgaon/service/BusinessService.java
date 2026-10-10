package com.digitalgaon.service;

import com.digitalgaon.model.Business;
import com.digitalgaon.model.BusinessCategory;
import com.digitalgaon.repository.BusinessCategoryRepository;
import com.digitalgaon.repository.BusinessRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BusinessService {

    private final BusinessRepository businessRepository;
    private final BusinessCategoryRepository categoryRepository;

    public BusinessService(BusinessRepository businessRepository, BusinessCategoryRepository categoryRepository) {
        this.businessRepository = businessRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Business> getAllBusinesses() {
        return businessRepository.findAllByOrderByRatingDesc();
    }

    public List<Business> getBusinessesByCategory(String categorySlug) {
        return businessRepository.findByCategory_Slug(categorySlug);
    }

    public List<Business> getFeaturedBusinesses() {
        return businessRepository.findByIsVerifiedTrue();
    }

    public List<Business> search(String query) {
        if (query == null || query.isBlank()) {
            return getAllBusinesses();
        }
        return businessRepository.searchBusinesses(query.trim());
    }

    public Optional<Business> getBusinessById(UUID id) {
        return businessRepository.findById(id);
    }

    public Optional<Business> getBusinessBySlug(String slug) {
        return businessRepository.findBySlug(slug);
    }

    public List<BusinessCategory> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc();
    }

    @Transactional
    public Business createBusiness(com.digitalgaon.dto.BusinessRequest req) {
        Business business = new Business();
        business.setName(req.getName());
        String slug = req.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-") + "-" + System.currentTimeMillis() % 10000;
        business.setSlug(slug);
        business.setDescription(req.getDescription() != null ? req.getDescription() : "Newly registered local enterprise");
        business.setAddress(req.getAddress() != null ? req.getAddress() : "Asgaon Market Road");
        business.setLandmark(req.getLandmark() != null ? req.getLandmark() : "Village Center");
        business.setPhone(req.getPhone());
        business.setWhatsapp(req.getWhatsapp() != null ? req.getWhatsapp() : req.getPhone());
        business.setOpeningHours(req.getOpeningHours() != null ? req.getOpeningHours() : "8:00 AM - 8:00 PM");
        business.setImageUrl(req.getImageUrl() != null && !req.getImageUrl().isBlank() 
                ? req.getImageUrl() 
                : "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80");
        business.setIsVerified(true);
        business.setVerificationBadge(req.getVerificationBadge() != null ? req.getVerificationBadge() : "Verified Merchant");
        business.setRating(req.getRating() != null ? req.getRating() : new java.math.BigDecimal("5.0"));
        business.setRatingCount(1);
        business.setLatitude(req.getLatitude() != null ? req.getLatitude() : new java.math.BigDecimal("20.7850"));
        business.setLongitude(req.getLongitude() != null ? req.getLongitude() : new java.math.BigDecimal("79.6350"));
        business.setCreatedAt(java.time.OffsetDateTime.now());

        // Assign category
        if (req.getCategory() != null && !req.getCategory().isBlank()) {
            String catSlug = req.getCategory().toLowerCase().replaceAll("[^a-z0-9]+", "-");
            BusinessCategory cat = categoryRepository.findBySlug(catSlug)
                    .orElseGet(() -> {
                        List<BusinessCategory> all = categoryRepository.findAllByOrderByDisplayOrderAsc();
                        return all.isEmpty() ? null : all.get(0);
                    });
            business.setCategory(cat);
        } else {
            List<BusinessCategory> all = categoryRepository.findAllByOrderByDisplayOrderAsc();
            if (!all.isEmpty()) {
                business.setCategory(all.get(0));
            }
        }

        return businessRepository.save(business);
    }

    @Transactional
    public Business saveBusiness(Business business) {
        return businessRepository.save(business);
    }
}
