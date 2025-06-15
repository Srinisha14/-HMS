package com.authservice.service; 

import com.authservice.dto.AuthRequest;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<?> register(AuthRequest request);
    ResponseEntity<?> generateToken(AuthRequest request);
    ResponseEntity<?> validateToken(String token);
    ResponseEntity<?> login(AuthRequest request); // ✅ Add login method
    ResponseEntity<?> deleteUser(String username);
}


