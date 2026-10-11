package com.digitalgaon.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://asgaon.vercel.app}")
    private String allowedOrigins;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // OpenAPI / Swagger & Actuator & Error
                        .requestMatchers("/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/actuator/**").permitAll()
                        .requestMatchers("/error", "/error/**").permitAll()
                        // Auth endpoints
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        // Public Read endpoints (Zero-barrier guest discovery)
                        .requestMatchers(HttpMethod.GET, "/api/v1/businesses", "/api/v1/businesses/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories", "/api/v1/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/jobs", "/api/v1/jobs/**").permitAll()
                        .requestMatchers("/api/v1/schemes", "/api/v1/schemes/**").permitAll()
                        .requestMatchers("/api/v1/announcements", "/api/v1/announcements/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/mandi", "/api/v1/mandi/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/marketplace", "/api/v1/marketplace/**").permitAll()
                        .requestMatchers("/api/v1/events", "/api/v1/events/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/complaints", "/api/v1/complaints/**").permitAll()
                        // Allow lodging complaints / marketplace / business registrations / job postings freely
                        .requestMatchers(HttpMethod.POST, "/api/v1/complaints", "/api/v1/complaints/**").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/complaints", "/api/v1/complaints/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/marketplace", "/api/v1/marketplace/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/businesses", "/api/v1/businesses/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/jobs", "/api/v1/jobs/**").permitAll()
                        // Admin endpoints
                        .requestMatchers("/api/v1/admin", "/api/v1/admin/**").permitAll()
                        // Cloudinary image upload endpoint
                        .requestMatchers("/api/v1/upload", "/api/v1/upload/**").permitAll()
                        // Web Push notifications endpoint
                        .requestMatchers("/api/v1/notifications", "/api/v1/notifications/**").permitAll()
                        // Village Blogs & Guides
                        .requestMatchers("/api/v1/blogs", "/api/v1/blogs/**").permitAll()
                        // All other endpoints require authentication
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        configuration.setExposedHeaders(Arrays.asList("Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
