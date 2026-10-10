package com.digitalgaon.service;

import com.digitalgaon.model.Scheme;
import com.digitalgaon.repository.SchemeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SchemeService {

    private final SchemeRepository schemeRepository;

    public SchemeService(SchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    public List<Scheme> getAllSchemes() {
        return schemeRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Scheme> getSchemesByCategory(String category) {
        return schemeRepository.findByCategoryIgnoreCase(category);
    }

    public Optional<Scheme> getSchemeById(UUID id) {
        return schemeRepository.findById(id);
    }

    public Optional<Scheme> getSchemeBySlug(String slug) {
        return schemeRepository.findBySlug(slug);
    }

    public Scheme createScheme(Scheme scheme) {
        if (scheme.getSlug() == null || scheme.getSlug().isBlank()) {
            String base = scheme.getTitle() != null ? scheme.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-") : "scheme";
            scheme.setSlug(base + "-" + (System.currentTimeMillis() % 100000));
        }
        if (scheme.getCreatedAt() == null) {
            scheme.setCreatedAt(java.time.OffsetDateTime.now());
        }
        return schemeRepository.save(scheme);
    }

    public Scheme updateScheme(UUID id, Scheme schemeDetails) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scheme not found with id: " + id));
        if (schemeDetails.getTitle() != null) scheme.setTitle(schemeDetails.getTitle());
        if (schemeDetails.getCategory() != null) scheme.setCategory(schemeDetails.getCategory());
        if (schemeDetails.getSponsoringAgency() != null) scheme.setSponsoringAgency(schemeDetails.getSponsoringAgency());
        if (schemeDetails.getDeadlineText() != null) scheme.setDeadlineText(schemeDetails.getDeadlineText());
        if (schemeDetails.getDescription() != null) scheme.setDescription(schemeDetails.getDescription());
        if (schemeDetails.getBenefits() != null) scheme.setBenefits(schemeDetails.getBenefits());
        if (schemeDetails.getEligibility() != null) scheme.setEligibility(schemeDetails.getEligibility());
        if (schemeDetails.getDocumentsRequired() != null) scheme.setDocumentsRequired(schemeDetails.getDocumentsRequired());
        if (schemeDetails.getOfficialUrl() != null) scheme.setOfficialUrl(schemeDetails.getOfficialUrl());
        if (schemeDetails.getActionLabel() != null) scheme.setActionLabel(schemeDetails.getActionLabel());
        return schemeRepository.save(scheme);
    }

    public void deleteScheme(UUID id) {
        schemeRepository.deleteById(id);
    }
}
