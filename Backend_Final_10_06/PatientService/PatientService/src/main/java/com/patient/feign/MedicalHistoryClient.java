package com.patient.feign;

import com.patient.entities.dto.MedicalHistoryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name="MEDICAL-HISTORY-SERVICE")
public interface MedicalHistoryClient {

    @GetMapping("/medical-history/patient/{patientId}")
    List<MedicalHistoryDTO> getMedicalHistoryByPatientId(@PathVariable("patientId") Integer patientId);

}
