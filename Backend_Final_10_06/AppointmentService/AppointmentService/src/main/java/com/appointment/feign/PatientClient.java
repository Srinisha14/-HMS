package com.appointment.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.appointment.entities.dto.PatientDTO;

@FeignClient(name="PATIENT-SERVICE")
public interface PatientClient {
	@GetMapping("/patient/{id}")
    PatientDTO getPatientById(@PathVariable Integer id) ;
    
}
