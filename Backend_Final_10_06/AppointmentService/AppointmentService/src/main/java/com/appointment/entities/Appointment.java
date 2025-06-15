package com.appointment.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer appointmentId;

    private Integer patientId;
    private Integer doctorId;
    private Integer scheduleId;

    private LocalDate appointmentDate;
    private LocalTime appointmentTime;

    private String status;

    @Column(nullable = false) // Ensuring this field is required
    private String reason;
}
