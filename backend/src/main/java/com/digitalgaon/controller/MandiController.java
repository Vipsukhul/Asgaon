package com.digitalgaon.controller;

import com.digitalgaon.dto.ApiResponse;
import com.digitalgaon.model.MandiPrice;
import com.digitalgaon.service.MandiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mandi")
@Tag(name = "Krishi & Mandi Prices", description = "Live APMC mandi rates for Pauni, Bhandara, and Nagpur")
public class MandiController {

    private final MandiService mandiService;

    public MandiController(MandiService mandiService) {
        this.mandiService = mandiService;
    }

    @GetMapping("/prices")
    @Operation(summary = "Get daily APMC mandi commodity rates")
    public ResponseEntity<ApiResponse<List<MandiPrice>>> getPrices(
            @RequestParam(required = false) String market,
            @RequestParam(required = false) String commodity) {
        
        List<MandiPrice> prices;
        if (market != null && !market.isBlank()) {
            prices = mandiService.getPricesByMarket(market);
        } else if (commodity != null && !commodity.isBlank()) {
            prices = mandiService.getPricesByCommodity(commodity);
        } else {
            prices = mandiService.getLatestPrices();
        }
        return ResponseEntity.ok(ApiResponse.ok(prices));
    }
}
