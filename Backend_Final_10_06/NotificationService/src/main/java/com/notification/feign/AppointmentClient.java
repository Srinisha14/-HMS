package com.notification.feign;

import com.notification.entity.dto.AppointmentDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "APPOINTMENT-SERVICE")
public interface AppointmentClient {

    @GetMapping("/appointment/{id}")
    AppointmentDTO getAppointmentById(@PathVariable Integer id);

    @GetMapping("/appointment/patient/{patientId}")
    List<AppointmentDTO> getAppointmentsByPatientId(@PathVariable Integer patientId);

    @GetMapping("/appointment/doctor/{doctorId}")
    List<AppointmentDTO> getAppointmentsByDoctorId(@PathVariable Integer doctorId);
}

