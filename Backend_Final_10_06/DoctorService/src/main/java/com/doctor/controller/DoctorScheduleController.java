package com.doctor.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.doctor.dto.DoctorScheduleDTO;
import com.doctor.entity.DoctorSchedule;
import com.doctor.service.DoctorScheduleService;
 
@RestController
@RequestMapping("/doctor/schedule")
public class DoctorScheduleController {
 
	@Autowired
	private DoctorScheduleService doctorScheduleService;
 
	@GetMapping
	public List<DoctorScheduleDTO> getAllSchedules() {
		List<DoctorSchedule> schedules = doctorScheduleService.getAllSchedules();
		return schedules.stream().map(DoctorScheduleDTO::new).toList();
	}
 
	@GetMapping("/{id}")
	public ResponseEntity<DoctorSchedule> getScheduleById(@PathVariable Integer id) {
		return ResponseEntity.ok(doctorScheduleService.getScheduleById(id));
	}
	
	@GetMapping("/doctor/{doctorId}")
	public List<DoctorScheduleDTO> getSchedulesByDoctor(@PathVariable Long doctorId) {
	    return doctorScheduleService.getSchedulesByDoctor(doctorId); // ✅ Return DTOs directly from service
	}

	
    
	@GetMapping("/available/{doctorId}/{date}")
	public ResponseEntity<List<DoctorScheduleDTO>> getDoctorAvailableSlots(@PathVariable Integer doctorId, @PathVariable String date) {
	    List<DoctorScheduleDTO> availableSlots = doctorScheduleService.getAvailableSlotsForDoctor(doctorId, LocalDate.parse(date));
	    return ResponseEntity.ok(availableSlots);
	}

	/*
	 * @GetMapping("/{id}") public ResponseEntity<DoctorSchedule>
	 * getScheduleById(@PathVariable Integer id) { DoctorSchedule schedule =
	 * doctorScheduleService.getScheduleById(id); if (schedule != null) { return
	 * ResponseEntity.ok(schedule); } throw new
	 * DoctorScheduleNotFoundException("Doctor Schedule not found with ID: " + id);
	 * }
	 */
 
	@PostMapping
	public DoctorSchedule createSchedule(@RequestBody DoctorSchedule schedule) {
		return doctorScheduleService.createSchedule(schedule);
	}
 
	@PutMapping("/{id}")
	public ResponseEntity<DoctorSchedule> updateSchedule(@PathVariable Integer id,
			@RequestBody DoctorSchedule schedule) {
		DoctorSchedule updatedSchedule = doctorScheduleService.updateSchedule(id, schedule);
		if (updatedSchedule != null) {
			return ResponseEntity.ok(updatedSchedule);
		}
		return ResponseEntity.notFound().build();
	}
 
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteSchedule(@PathVariable Integer id) {
		doctorScheduleService.deleteSchedule(id);
		return ResponseEntity.noContent().build();
	}
	
	@GetMapping("/available/{doctorId}/{date}/{time}")
	public boolean isDoctorAvailable(
	        @PathVariable Integer doctorId,
	        @PathVariable String date,
	        @PathVariable String time) {

	    LocalDate parsedDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE); // "YYYY-MM-DD"
	    LocalTime parsedTime = LocalTime.parse(time, DateTimeFormatter.ofPattern("HH:mm")); // "HH:mm"

	    return doctorScheduleService.isDoctorAvailable(doctorId, parsedDate, parsedTime);
	}


 

 
}
