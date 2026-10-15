package com.digitalgaon.repository;

import com.digitalgaon.model.GalleryImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GalleryImageRepository extends JpaRepository<GalleryImage, UUID> {
    List<GalleryImage> findAllByOrderByDisplayOrderAsc();
    List<GalleryImage> findByCategoryIgnoreCaseOrderByDisplayOrderAsc(String category);
}
