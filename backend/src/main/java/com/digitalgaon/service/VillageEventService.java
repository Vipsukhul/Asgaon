package com.digitalgaon.service;

import com.digitalgaon.model.VillageEvent;
import com.digitalgaon.repository.VillageEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class VillageEventService {

    private final VillageEventRepository eventRepository;

    public VillageEventService(VillageEventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<VillageEvent> getAllEvents() {
        return eventRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<VillageEvent> getEventsByCategory(String category) {
        return eventRepository.findByCategoryIgnoreCase(category);
    }

    public Optional<VillageEvent> getEventById(UUID id) {
        return eventRepository.findById(id);
    }

    public VillageEvent createEvent(VillageEvent event) {
        if (event.getCreatedAt() == null) {
            event.setCreatedAt(java.time.OffsetDateTime.now());
        }
        return eventRepository.save(event);
    }

    public Optional<VillageEvent> updateEvent(UUID id, VillageEvent updated) {
        return eventRepository.findById(id).map(existing -> {
            if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
            if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
            if (updated.getEventDate() != null) existing.setEventDate(updated.getEventDate());
            if (updated.getEventTime() != null) existing.setEventTime(updated.getEventTime());
            if (updated.getLocation() != null) existing.setLocation(updated.getLocation());
            if (updated.getOrganizer() != null) existing.setOrganizer(updated.getOrganizer());
            if (updated.getBadge() != null) existing.setBadge(updated.getBadge());
            if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
            if (updated.getImageUrl() != null) existing.setImageUrl(updated.getImageUrl());
            return eventRepository.save(existing);
        });
    }

    public boolean deleteEvent(UUID id) {
        if (eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
