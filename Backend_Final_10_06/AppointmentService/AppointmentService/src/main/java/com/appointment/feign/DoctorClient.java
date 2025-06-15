package com.appointment.feign;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.appointment.entities.dto.DoctorDTO;
import com.appointment.entities.dto.DoctorScheduleDTO;
 
@FeignClient(name = "DOCTOR-SERVICE")
public interface DoctorClient {

    @GetMapping("/doctor/{id}")
    DoctorDTO getDoctorById(@PathVariable Integer id);

    @GetMapping("/doctor/specialization/{specialization}")
    List<DoctorDTO> getDoctorsBySpecialization(@PathVariable String specialization);

    @GetMapping("/doctor/schedule/available/{doctorId}/{date}")
    List<DoctorScheduleDTO> getDoctorAvailableSlots(@PathVariable Integer doctorId, @PathVariable String date);
    
    @GetMapping("doctor/schedule/available/{doctorId}/{date}/{time}")
    boolean isDoctorAvailable(@PathVariable Integer doctorId, @PathVariable String date, @PathVariable String time);
}