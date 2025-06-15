package com.doctor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.doctor.dto.AppointmentDTO;
import com.doctor.dto.DoctorDTO;
import com.doctor.entity.DoctorEntity;
import com.doctor.feign.AppointmentClient;
import com.doctor.service.DoctorService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

	@Autowired
	private DoctorService doctorService;

	@Autowired
	private AppointmentClient appointmentClient; // Feign Client to fetch appointments

	// POST - Register a doctor
	@PostMapping
	public ResponseEntity<DoctorEntity> createDoctor(@RequestBody DoctorEntity doctor) {
		return ResponseEntity.ok(doctorService.createDoctor(doctor));
	}

	// GET - Fetch all doctors
	@GetMapping
	public ResponseEntity<List<DoctorEntity>> getAllDoctors() {
		return ResponseEntity.ok(doctorService.getAllDoctors());
	}

	// GET - Fetch doctor by ID with appointments from AppointmentService
	@GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable Integer id) {
        DoctorEntity doctor = doctorService.getDoctorById(id);
        
        // Fetch appointments via Feign Client
//        List<AppointmentDTO> appointments = appointmentClient.getAppointmentsByDoctorId(id);

        ResponseEntity<List<AppointmentDTO>> response = appointmentClient.getAppointmentsByDoctorId(id);
        List<AppointmentDTO> appointments = response.getBody();
        
        System.out.println("Appointments received from Feign Client: " + appointments);
        
        // Convert entity to DTO
        DoctorDTO doctorDTO = new DoctorDTO(
                doctor.getDoctorId(),
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getEmail(),
                doctor.getPhone(),
                appointments.stream()
                .map(AppointmentDTO::getAppointmentId) // Extract IDs
                .collect(Collectors.toList())
        );

        return ResponseEntity.ok(doctorDTO);
    }

	// GET - Fetch doctor by name
	@GetMapping("/name/{name}")
	public ResponseEntity<DoctorDTO> getDoctorByName(@PathVariable String name) {
		DoctorEntity doctor = doctorService.getDoctorByName(name);

//        List<AppointmentDTO> appointments = appointmentClient.getAppointmentsByDoctorId(doctor.getId());

		ResponseEntity<List<AppointmentDTO>> response = appointmentClient.getAppointmentsByDoctorId(doctor.getDoctorId());
		List<AppointmentDTO> appointments = response.getBody();

		DoctorDTO doctorDTO = new DoctorDTO(doctor.getDoctorId(), doctor.getName(), doctor.getSpecialization(),
				doctor.getEmail(), doctor.getPhone(), appointments.stream().map(AppointmentDTO::getAppointmentId) // Extract
				.collect(Collectors.toList()));

		return ResponseEntity.ok(doctorDTO);
	}

	// GET - Fetch doctor by email
	@GetMapping("/email/{email}")
	public ResponseEntity<DoctorEntity> getDoctorByEmail(@PathVariable String email) {
		return ResponseEntity.ok(doctorService.getDoctorByEmail(email));
	}

	@GetMapping("/specialization/{specialization}")
	public ResponseEntity<List<DoctorDTO>> getDoctorsBySpecialization(@PathVariable String specialization) {
		List<DoctorEntity> doctors = doctorService.getDoctorBySpecialization(specialization);

		List<DoctorDTO> doctorDTOs = doctors.stream()
                .map(doc -> {
                    ResponseEntity<List<AppointmentDTO>> response = appointmentClient.getAppointmentsByDoctorId(doc.getDoctorId());
                    List<AppointmentDTO> appointments = response.getBody();

                    return new DoctorDTO(
                            doc.getDoctorId(),
                            doc.getName(),
                            doc.getSpecialization(),
                            doc.getEmail(),
                            doc.getPhone(),
                            appointments.stream()
                                    .map(AppointmentDTO::getAppointmentId)
                                    .collect(Collectors.toList())
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(doctorDTOs);
	}

	// PUT - Update a doctor's details
	@PutMapping("/{id}")
	public ResponseEntity<DoctorEntity> updateDoctor(@PathVariable Integer id, @RequestBody DoctorEntity doctor) {
		DoctorEntity updatedDoctor = doctorService.updateDoctor(id, doctor);
		return updatedDoctor != null ? ResponseEntity.ok(updatedDoctor) : ResponseEntity.notFound().build();
	}

	// DELETE - Remove a doctor by ID
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteDoctorById(@PathVariable Integer id) {
		doctorService.deleteDoctorById(id);
		return ResponseEntity.ok("Doctor with ID " + id + " deleted successfully.");
	}

	// DELETE - Remove a doctor by name
	@DeleteMapping("/name/{name}")
	public ResponseEntity<String> deleteDoctorByName(@PathVariable String name) {
		doctorService.deleteDoctorByName(name);
		return ResponseEntity.ok("Doctor with name " + name + " deleted successfully.");
	}
}
