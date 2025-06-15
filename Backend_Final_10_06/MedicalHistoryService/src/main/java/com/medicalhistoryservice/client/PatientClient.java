package com.medicalhistoryservice.client;

import com.medicalhistoryservice.entity.dto.PatientDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "PATIENT-SERVICE")
public interface PatientClient {
    @GetMapping("/patient/{id}")
    ResponseEntity<PatientDTO> getPatientById(@PathVariable Integer id);
}

