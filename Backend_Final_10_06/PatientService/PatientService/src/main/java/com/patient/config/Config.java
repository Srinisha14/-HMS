package com.patient.config;
 
import org.springframework.context.annotation.Bean;
 
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
 
 
@Configuration
public class Config {
 

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for API calls
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/patient").permitAll() // ✅ Allow patient registration
                .anyRequest().permitAll() // Require authentication for other endpoints
            );

        return http.build();
    }

}