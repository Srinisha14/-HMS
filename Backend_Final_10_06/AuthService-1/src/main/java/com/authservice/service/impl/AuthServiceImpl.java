package com.authservice.service.impl; 

import com.authservice.dto.AuthRequest;

import com.authservice.entity.User;
import com.authservice.repository.UserRepository;
import com.authservice.service.AuthService;
import com.authservice.utils.JwtService;

import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserCredentialsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Override
    public ResponseEntity<?> register(AuthRequest request) {
    	System.out.println("received request"+request.getUsername());
        if (userRepository.findByUsername(request.getUsername()) != null) {
            return ResponseEntity.badRequest().body("User already exists");
        }
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getUsername(), encodedPassword,request.getRole());
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @Override
    public ResponseEntity<?> generateToken(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        User user = userRepository.findByUsername(request.getUsername());
        Map<String,Object> claims = Map.of("role",user.getRole());

        // ✅ Fixed: Pass an empty Map as extra claims
        String token = jwtService.generateToken(claims, userDetails); 
        return ResponseEntity.ok(token);
    }

    @Override
    public ResponseEntity<?> validateToken(String token) {
        String username = jwtService.extractUsername(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // ✅ Fixed: Ensure this method exists in JwtService
        boolean isValid = jwtService.isTokenValid(token, userDetails);
        return ResponseEntity.ok(isValid ? "Valid Token" : "Invalid Token");
    }
    @Override
    public ResponseEntity<?> login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        User user = userRepository.findByUsername(request.getUsername());

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Map<String,Object> claims = Map.of("role", user.getRole());
        String token = jwtService.generateToken(claims, userDetails);

        // ✅ Return token & role
        Map<String, String> response = Map.of(
                "token", token,
                "role", user.getRole()
        );

        return ResponseEntity.ok(response);
    }
    @Override
    public ResponseEntity<?> deleteUser(String username) {
        // Find the user by username
        // Using Optional<User> for safer handling of non-existent users
        User user = userRepository.findByUsername(username);
 
        if (user != null) {
            userRepository.delete(user); // Delete the user if found
            return ResponseEntity.ok("User '" + username + "' deleted successfully.");
        } else {
            // Return 404 Not Found if user does not exist
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User '" + username + "' not found.");
        }
    }

    

}
