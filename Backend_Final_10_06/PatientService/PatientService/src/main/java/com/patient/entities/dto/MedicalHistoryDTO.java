package com.patient.entities.dto;

import java.util.Date;
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
    private Date dateOfVisit;
}
