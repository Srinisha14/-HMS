package com.patient.entities.dto;

import java.util.Date;
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
    private Date dateOfBirth; // Add dateOfBirth
    private String address; // Add address
    private List<Integer> appointmentId;
    private List<MedicalHistoryDTO> medicalHistories;

}
