package com.gateway.util; 

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.net.URLDecoder;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey key;

    // 24 hours (example)
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    @PostConstruct
    public void initKey() {
        // Base64-encode the raw secret and build the HMAC key
        String encoded = Base64.getEncoder()
                .encodeToString(secret.getBytes(StandardCharsets.UTF_8));
        this.key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(encoded));
        System.out.println("API-Gateway Encoded Key: " + encoded);
    }

    public void validateToken(String token) {
        try {
            // (Optional) URL-decode in case it was URL-encoded in transit
            String decoded = URLDecoder.decode(token, StandardCharsets.UTF_8);

            System.out.println("Received Token (Raw): " + token);
            System.out.println("Decoded Token: " + decoded);

            // Actually parse and verify signature + expiration
            Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(decoded);

        } catch (JwtException e) {
            System.out.println("Token validation failed: " + e.getMessage());
            throw new RuntimeException("Invalid JWT Token");
        }
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("role", String.class);
    }

    public boolean isTokenExpired(String token) {
        Date expiration = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
        return expiration.before(new Date());
    }
}

