package com.doctor.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import lombok.*;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDTO {

    private Integer appointmentId;
    private Integer patientId;
    private Integer doctorId;
    private Integer scheduleId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String status;

    @Column(nullable = false)
    private String reason;
}
