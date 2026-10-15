package com.digitalgaon.repository;

import com.digitalgaon.model.TransportBus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransportBusRepository extends JpaRepository<TransportBus, UUID> {
    List<TransportBus> findAllByOrderByDepartureTime24Asc();
}
