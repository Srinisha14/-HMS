package com.medicalhistoryservice.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.medicalhistoryservice.entity.dto.AppointmentDTO;

@FeignClient(name = "appointment-service", url = "http://localhost:8082") // Adjust URL
public interface AppointmentClient {
    @GetMapping("/appointments/patient/{patientId}")
    List<AppointmentDTO> getAppointmentsByPatient(@PathVariable Integer patientId);
}

