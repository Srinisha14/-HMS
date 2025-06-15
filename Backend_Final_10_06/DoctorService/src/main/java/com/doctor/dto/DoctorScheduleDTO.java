package com.doctor.dto;

import java.time.LocalDate;
import com.doctor.entity.DoctorSchedule;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorScheduleDTO {
    private Integer scheduleId;
    private String availableTimeSlots;
    private Integer doctorId;
    private String doctorName; // Add doctor's name
    private String doctorSpecialization; // Add doctor's specialization
    private LocalDate date;

    // Constructor to map from `DoctorSchedule` entity
    public DoctorScheduleDTO(DoctorSchedule schedule) {
        this.scheduleId = schedule.getScheduleId();
        this.availableTimeSlots = schedule.getAvailableTimeSlots();
        this.doctorId = schedule.getDoctor().getDoctorId();
        this.doctorName = schedule.getDoctor().getName(); // Fetch doctor's name
        this.doctorSpecialization = schedule.getDoctor().getSpecialization(); // Fetch specialization
        this.date = schedule.getDate();
    }
}