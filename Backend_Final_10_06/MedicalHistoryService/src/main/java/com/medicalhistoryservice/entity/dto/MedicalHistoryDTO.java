package com.medicalhistoryservice.entity.dto;

import java.time.LocalDate;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalHistoryDTO {
    private Integer historyId;
    private String diagnosis;
    private String treatment;
    private LocalDate dateOfVisit;
    private Integer patientId;
}
