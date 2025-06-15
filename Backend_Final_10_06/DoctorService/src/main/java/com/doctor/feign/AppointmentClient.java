package com.doctor.feign;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.doctor.dto.AppointmentDTO;

import java.util.List;

@FeignClient(name = "APPOINTMENT-SERVICE") // Service name registered in Eureka
public interface AppointmentClient {

    @GetMapping("/appointment/doctor/{doctorId}")
    ResponseEntity<List<AppointmentDTO>> getAppointmentsByDoctorId(@PathVariable Integer doctorId);
}
