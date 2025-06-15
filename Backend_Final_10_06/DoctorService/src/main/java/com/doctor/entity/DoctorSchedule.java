package com.doctor.entity;

import java.time.LocalDate;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

@Entity
@Table(name = "doctor_schedule")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer scheduleId;

    @ManyToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctorId")
    @JsonBackReference
    private DoctorEntity doctor;

    private String availableTimeSlots;
    private LocalDate date;

    public boolean isAvailable() {
        return availableTimeSlots != null && !availableTimeSlots.trim().isEmpty();
    }
}
