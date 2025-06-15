package com.notification.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.notification.entity.dto.PatientDTO;

@FeignClient(name = "PATIENT-SERVICE")
public interface PatientClient {
    @GetMapping("/patient/{id}")
    PatientDTO getPatientById(@PathVariable Integer id);
}
