package com.appointment.entities.dto;

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
}
