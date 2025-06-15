package com.patient.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Date;

@Data // Generates getters, setters, toString, equals, and hashCode
@NoArgsConstructor // Generates a no-args constructor
@AllArgsConstructor // Generates an all-args constructor
@Builder
@Entity
@Table(name = "patient")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer patientId;

    @Column(nullable = false)
    private String name;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date dateOfBirth;

    @Column(length = 10, nullable = false)
    private String gender;

    @Column(length = 255, nullable = false)
    private String address;

    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @Pattern(regexp = "\\d{10}", message = "Contact number must be 10 digits")
    @Column(unique = true, nullable = false)
    private String contactNumber;

    @Column(length = 3, nullable = false)
    @Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Invalid blood group format")
    private String bloodGroup;
}
