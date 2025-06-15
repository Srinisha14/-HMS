package com.appointment.entities.dto;

import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDTO {
    private Integer doctorId;
    private String name;
    private String specialization;
    private String email;
    private String phone;
    private List<Integer> appointmentIds;
}
