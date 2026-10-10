package com.digitalgaon.repository;

import com.digitalgaon.model.MandiPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MandiPriceRepository extends JpaRepository<MandiPrice, Long> {
    List<MandiPrice> findAllByOrderByPriceDateDesc();
    List<MandiPrice> findByMarketNameIgnoreCase(String marketName);
    List<MandiPrice> findByCommodityNameIgnoreCase(String commodityName);
    List<MandiPrice> findByPriceDate(LocalDate priceDate);
}
