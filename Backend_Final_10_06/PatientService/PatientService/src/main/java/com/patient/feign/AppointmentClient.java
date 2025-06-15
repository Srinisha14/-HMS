package com.patient.feign;

import com.patient.entities.dto.AppointmentDTO;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name="APPOINTMENT-SERVICE")
public interface AppointmentClient {
	@GetMapping("/appointment/patient/{patientId}")
	List<AppointmentDTO> getAppointmentsByPatientId(@PathVariable Integer patientId);
}

