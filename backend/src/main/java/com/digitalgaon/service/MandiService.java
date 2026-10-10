package com.digitalgaon.service;

import com.digitalgaon.model.MandiPrice;
import com.digitalgaon.repository.MandiPriceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MandiService {

    private final MandiPriceRepository mandiPriceRepository;

    public MandiService(MandiPriceRepository mandiPriceRepository) {
        this.mandiPriceRepository = mandiPriceRepository;
    }

    public List<MandiPrice> getLatestPrices() {
        return mandiPriceRepository.findAllByOrderByPriceDateDesc();
    }

    public List<MandiPrice> getPricesByMarket(String marketName) {
        return mandiPriceRepository.findByMarketNameIgnoreCase(marketName);
    }

    public List<MandiPrice> getPricesByCommodity(String commodityName) {
        return mandiPriceRepository.findByCommodityNameIgnoreCase(commodityName);
    }
}
