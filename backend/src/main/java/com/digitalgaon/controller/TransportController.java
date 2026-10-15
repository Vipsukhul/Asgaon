package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.model.AutoDriver;
import com.digitalgaon.model.DepotContact;
import com.digitalgaon.model.TransportBus;
import com.digitalgaon.repository.AutoDriverRepository;
import com.digitalgaon.repository.DepotContactRepository;
import com.digitalgaon.repository.TransportBusRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transport")
@Tag(name = "Transport & Connectivity", description = "MSRTC bus schedules, auto stands, and depot contacts")
public class TransportController {

    private final TransportBusRepository busRepository;
    private final AutoDriverRepository autoDriverRepository;
    private final DepotContactRepository depotContactRepository;

    public TransportController(TransportBusRepository busRepository,
                               AutoDriverRepository autoDriverRepository,
                               DepotContactRepository depotContactRepository) {
        this.busRepository = busRepository;
        this.autoDriverRepository = autoDriverRepository;
        this.depotContactRepository = depotContactRepository;
    }

    // --- Bus Schedules ---
    @GetMapping("/buses")
    @Operation(summary = "Get all bus schedules")
    public ResponseEntity<ApiResponse<List<TransportBus>>> getBuses() {
        return ResponseEntity.ok(ApiResponse.ok(busRepository.findAllByOrderByDepartureTime24Asc()));
    }

    @PostMapping("/buses")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a bus schedule (Admin only)")
    public ResponseEntity<ApiResponse<TransportBus>> createBus(@RequestBody TransportBus bus) {
        TransportBus saved = busRepository.save(bus);
        return ResponseEntity.ok(ApiResponse.ok("Bus schedule created successfully", saved));
    }

    @PutMapping("/buses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a bus schedule (Admin only)")
    public ResponseEntity<ApiResponse<TransportBus>> updateBus(@PathVariable UUID id, @RequestBody TransportBus updated) {
        return busRepository.findById(id).map(existing -> {
            existing.setBusNumber(updated.getBusNumber());
            existing.setSource(updated.getSource());
            existing.setDestination(updated.getDestination());
            existing.setSourceMarathi(updated.getSourceMarathi());
            existing.setDestinationMarathi(updated.getDestinationMarathi());
            existing.setVia(updated.getVia());
            existing.setViaMarathi(updated.getViaMarathi());
            existing.setDepartureTime(updated.getDepartureTime());
            existing.setDepartureTime24(updated.getDepartureTime24());
            existing.setApproxArrivalTime(updated.getApproxArrivalTime());
            existing.setDurationMinutes(updated.getDurationMinutes());
            existing.setBusType(updated.getBusType());
            existing.setBusTypeMarathi(updated.getBusTypeMarathi());
            existing.setDepot(updated.getDepot());
            existing.setDepotMarathi(updated.getDepotMarathi());
            existing.setFareGeneral(updated.getFareGeneral());
            existing.setFareMahila(updated.getFareMahila());
            existing.setFareSenior(updated.getFareSenior());
            existing.setFrequency(updated.getFrequency());
            existing.setFrequencyMarathi(updated.getFrequencyMarathi());
            existing.setBoardingPointAtAsgaon(updated.getBoardingPointAtAsgaon());
            existing.setBoardingPointMarathi(updated.getBoardingPointMarathi());
            existing.setIsPopular(updated.getIsPopular());
            TransportBus saved = busRepository.save(existing);
            return ResponseEntity.ok(ApiResponse.ok("Bus schedule updated successfully", saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/buses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a bus schedule (Admin only)")
    public ResponseEntity<ApiResponse<String>> deleteBus(@PathVariable UUID id) {
        if (!busRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        busRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Bus schedule deleted successfully", id.toString()));
    }

    // --- Auto Drivers ---
    @GetMapping("/autos")
    @Operation(summary = "Get all registered auto drivers and stands")
    public ResponseEntity<ApiResponse<List<AutoDriver>>> getAutos() {
        return ResponseEntity.ok(ApiResponse.ok(autoDriverRepository.findAll()));
    }

    @PostMapping("/autos")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add an auto driver (Admin only)")
    public ResponseEntity<ApiResponse<AutoDriver>> createAuto(@RequestBody AutoDriver auto) {
        AutoDriver saved = autoDriverRepository.save(auto);
        return ResponseEntity.ok(ApiResponse.ok("Auto driver created successfully", saved));
    }

    @PutMapping("/autos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update auto driver (Admin only)")
    public ResponseEntity<ApiResponse<AutoDriver>> updateAuto(@PathVariable UUID id, @RequestBody AutoDriver updated) {
        return autoDriverRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setNameMarathi(updated.getNameMarathi());
            existing.setVehicleNumber(updated.getVehicleNumber());
            existing.setVehicleType(updated.getVehicleType());
            existing.setPhone(updated.getPhone());
            existing.setStandLocation(updated.getStandLocation());
            existing.setStandLocationMarathi(updated.getStandLocationMarathi());
            existing.setPrimaryRoute(updated.getPrimaryRoute());
            existing.setPrimaryRouteMarathi(updated.getPrimaryRouteMarathi());
            existing.setEstimatedFare(updated.getEstimatedFare());
            existing.setIsAvailable(updated.getIsAvailable());
            AutoDriver saved = autoDriverRepository.save(existing);
            return ResponseEntity.ok(ApiResponse.ok("Auto driver updated successfully", saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/autos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an auto driver (Admin only)")
    public ResponseEntity<ApiResponse<String>> deleteAuto(@PathVariable UUID id) {
        if (!autoDriverRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        autoDriverRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Auto driver deleted successfully", id.toString()));
    }

    // --- Depot Contacts ---
    @GetMapping("/depots")
    @Operation(summary = "Get bus depot inquiry numbers and help desks")
    public ResponseEntity<ApiResponse<List<DepotContact>>> getDepots() {
        return ResponseEntity.ok(ApiResponse.ok(depotContactRepository.findAll()));
    }
}
