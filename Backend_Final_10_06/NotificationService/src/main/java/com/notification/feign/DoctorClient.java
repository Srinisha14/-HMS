package com.notification.feign;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.notification.entity.dto.DoctorDTO;

@FeignClient(name = "DOCTOR-SERVICE")
public interface DoctorClient {
    @GetMapping("/doctor/{id}")
    DoctorDTO getDoctorById(@PathVariable Integer id);
}

