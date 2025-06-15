package com.authservice.entity; 

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    private String username;

    private String password;
    
    @Pattern(regexp = "^(ADMIN|PATIENT|DOCTOR)$", message = "Role must be ADMIN, PATIENT, or DOCTOR")
    private String role;

    // Constructors, Getters, and Setters
    public User() {}

    public User(String username, String password,String role) {
        this.username = username;
        this.password = password;
        this.role=role;
    }

    public Integer getId() { return id; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
}

