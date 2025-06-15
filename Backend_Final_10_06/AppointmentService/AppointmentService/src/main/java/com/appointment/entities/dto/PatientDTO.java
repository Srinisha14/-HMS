package com.appointment.entities.dto;

import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDTO {
    private Integer patientId;
    private String name;
    private String email;
    private String contactNumber;
    private String gender;
    private String bloodGroup;
    private List<Integer> appointmentId;
}
