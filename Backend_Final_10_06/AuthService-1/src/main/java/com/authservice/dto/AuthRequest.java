package com.authservice.dto; 

public class AuthRequest {
    private String username;
    private String password;
    private String role;
    private String token; // ✅ Add token field

    public AuthRequest() {}

    public AuthRequest(String username, String password, String role, String token) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.token = token; // ✅ Store token
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getToken() { return token; } // ✅ Getter for token
    public void setToken(String token) { this.token = token; } // ✅ Setter for token
}
