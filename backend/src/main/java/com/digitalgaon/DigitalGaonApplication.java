package com.digitalgaon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.nio.charset.StandardCharsets;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class DigitalGaonApplication {

    public static void main(String[] args) {
        loadEnvIfPresent();
        SpringApplication.run(DigitalGaonApplication.class, args);
    }

    private static void loadEnvIfPresent() {
        File[] candidates = new File[] {
            new File(".env"),
            new File("backend/.env"),
            new File("../backend/.env"),
            new File("../.env")
        };

        for (File file : candidates) {
            if (file.exists() && file.isFile()) {
                System.out.println(">>> [DigitalGaonApplication] Loading local environment variables from " + file.getAbsolutePath());
                try (BufferedReader reader = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) continue;
                        int idx = line.indexOf('=');
                        if (idx > 0) {
                            String key = line.substring(0, idx).trim();
                            String value = line.substring(idx + 1).trim();
                            if ((value.startsWith("\"") && value.endsWith("\"")) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                                if (value.length() >= 2) {
                                    value = value.substring(1, value.length() - 1);
                                }
                            }
                            if (System.getProperty(key) == null && System.getenv(key) == null) {
                                System.setProperty(key, value);
                            }
                        }
                    }
                    break;
                } catch (Exception e) {
                    System.err.println(">>> [DigitalGaonApplication] Could not load " + file.getAbsolutePath() + ": " + e.getMessage());
                }
            }
        }
    }
}

