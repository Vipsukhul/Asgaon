package com.digitalgaon.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "transport_buses")
public class TransportBus {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "bus_number", length = 50)
    private String busNumber;

    @Column(nullable = false, length = 100)
    private String source;

    @Column(nullable = false, length = 100)
    private String destination;

    @Column(name = "source_marathi", length = 100)
    private String sourceMarathi;

    @Column(name = "destination_marathi", length = 100)
    private String destinationMarathi;

    @Column(columnDefinition = "TEXT")
    private String via;

    @Column(name = "via_marathi", columnDefinition = "TEXT")
    private String viaMarathi;

    @Column(name = "departure_time", nullable = false, length = 50)
    private String departureTime;

    @Column(name = "departure_time_24", length = 20)
    private String departureTime24;

    @Column(name = "approx_arrival_time", length = 50)
    private String approxArrivalTime;

    @Column(name = "duration_minutes")
    private Integer durationMinutes = 30;

    @Column(name = "bus_type", length = 50)
    private String busType = "Lalpari";

    @Column(name = "bus_type_marathi", length = 50)
    private String busTypeMarathi;

    @Column(length = 100)
    private String depot;

    @Column(name = "depot_marathi", length = 100)
    private String depotMarathi;

    @Column(name = "fare_general")
    private Integer fareGeneral = 20;

    @Column(name = "fare_mahila")
    private Integer fareMahila = 10;

    @Column(name = "fare_senior")
    private Integer fareSenior = 0;

    @Column(length = 100)
    private String frequency = "Daily";

    @Column(name = "frequency_marathi", length = 100)
    private String frequencyMarathi;

    @Column(name = "boarding_point_at_asgaon", length = 150)
    private String boardingPointAtAsgaon;

    @Column(name = "boarding_point_marathi", length = 150)
    private String boardingPointMarathi;

    @Column(name = "is_popular")
    private Boolean isPopular = false;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public TransportBus() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getSourceMarathi() { return sourceMarathi; }
    public void setSourceMarathi(String sourceMarathi) { this.sourceMarathi = sourceMarathi; }

    public String getDestinationMarathi() { return destinationMarathi; }
    public void setDestinationMarathi(String destinationMarathi) { this.destinationMarathi = destinationMarathi; }

    public String getVia() { return via; }
    public void setVia(String via) { this.via = via; }

    public String getViaMarathi() { return viaMarathi; }
    public void setViaMarathi(String viaMarathi) { this.viaMarathi = viaMarathi; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getDepartureTime24() { return departureTime24; }
    public void setDepartureTime24(String departureTime24) { this.departureTime24 = departureTime24; }

    public String getApproxArrivalTime() { return approxArrivalTime; }
    public void setApproxArrivalTime(String approxArrivalTime) { this.approxArrivalTime = approxArrivalTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getBusType() { return busType; }
    public void setBusType(String busType) { this.busType = busType; }

    public String getBusTypeMarathi() { return busTypeMarathi; }
    public void setBusTypeMarathi(String busTypeMarathi) { this.busTypeMarathi = busTypeMarathi; }

    public String getDepot() { return depot; }
    public void setDepot(String depot) { this.depot = depot; }

    public String getDepotMarathi() { return depotMarathi; }
    public void setDepotMarathi(String depotMarathi) { this.depotMarathi = depotMarathi; }

    public Integer getFareGeneral() { return fareGeneral; }
    public void setFareGeneral(Integer fareGeneral) { this.fareGeneral = fareGeneral; }

    public Integer getFareMahila() { return fareMahila; }
    public void setFareMahila(Integer fareMahila) { this.fareMahila = fareMahila; }

    public Integer getFareSenior() { return fareSenior; }
    public void setFareSenior(Integer fareSenior) { this.fareSenior = fareSenior; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getFrequencyMarathi() { return frequencyMarathi; }
    public void setFrequencyMarathi(String frequencyMarathi) { this.frequencyMarathi = frequencyMarathi; }

    public String getBoardingPointAtAsgaon() { return boardingPointAtAsgaon; }
    public void setBoardingPointAtAsgaon(String boardingPointAtAsgaon) { this.boardingPointAtAsgaon = boardingPointAtAsgaon; }

    public String getBoardingPointMarathi() { return boardingPointMarathi; }
    public void setBoardingPointMarathi(String boardingPointMarathi) { this.boardingPointMarathi = boardingPointMarathi; }

    public Boolean getIsPopular() { return isPopular; }
    public void setIsPopular(Boolean popular) { isPopular = popular; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
