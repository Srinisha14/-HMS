package com.appointment.controller;

import com.appointment.entities.Appointment;
import com.appointment.entities.dto.AppointmentDTO;
import com.appointment.entities.dto.DoctorDTO;
import com.appointment.entities.dto.DoctorScheduleDTO;
import com.appointment.services.AppointmentServices;
import com.appointment.exception.AppointmentNotFoundException;
import com.appointment.feign.DoctorClient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentServices appointmentServices;
    
    @Autowired
    private DoctorClient doctorClient;
    @GetMapping
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentServices.getAllAppointments().stream()
                .map(appt -> new AppointmentDTO(
                        appt.getAppointmentId(),
                        appt.getAppointmentDate(),
                        appt.getAppointmentTime(),
                        appt.getStatus(),
                        appt.getPatientId(),
                        appt.getDoctorId(),
                        appt.getScheduleId(),
                        appt.getReason() // Include reason
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Integer id) {
        Appointment appointment = appointmentServices.getAppointmentById(id);
        if (appointment == null) {
            return ResponseEntity.status(404).body(new AppointmentNotFoundException("Appointment not found with ID: " + id).getMessage());
        }
        AppointmentDTO appointmentDTO = new AppointmentDTO(
                appointment.getAppointmentId(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                appointment.getStatus(),
                appointment.getPatientId(),
                appointment.getDoctorId(),
                appointment.getScheduleId(),
                appointment.getReason() // Include reason
        );
        return ResponseEntity.ok(appointmentDTO);
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        if (appointment.getReason() == null || appointment.getReason().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Reason for appointment is required.");
        }

        try {
            Appointment newAppointment = appointmentServices.createAppointment(appointment);
            return ResponseEntity.status(201).body(newAppointment);
            
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body("Invalid appointment request. Please check the details and try again.\n"+e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Integer id, @RequestBody Appointment appointment) {
        Appointment updatedAppointment = appointmentServices.updateAppointment(id, appointment);
        return updatedAppointment != null ? ResponseEntity.ok(updatedAppointment) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Integer id) {
        appointmentServices.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient/{patientId}")
    public List<AppointmentDTO> getAppointmentsByPatientId(@PathVariable Integer patientId) {
        return appointmentServices.getAppointmentsByPatientId(patientId).stream()
                .map(appt -> new AppointmentDTO(
                        appt.getAppointmentId(),
                        appt.getAppointmentDate(),
                        appt.getAppointmentTime(),
                        appt.getStatus(),
                        appt.getPatientId(),
                        appt.getDoctorId(),
                        appt.getScheduleId(),
                        appt.getReason() // Include reason
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByDoctorId(@PathVariable Integer doctorId) {
        List<AppointmentDTO> appointments = appointmentServices.getAppointmentsByDoctorId(doctorId).stream()
                .map(appt -> new AppointmentDTO(
                        appt.getAppointmentId(),
                        appt.getAppointmentDate(),
                        appt.getAppointmentTime(),
                        appt.getStatus(),
                        appt.getPatientId(),
                        appt.getDoctorId(),
                        appt.getScheduleId(),
                        appt.getReason() // Include reason
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(appointments);
    }
    @GetMapping("/doctor/specialization/{specialization}")
    public ResponseEntity<List<DoctorDTO>> getDoctorsBySpecialization(@PathVariable String specialization) {
        List<DoctorDTO> doctors = doctorClient.getDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(doctors);
    }
    
    @GetMapping("/doctor/schedule/available/{doctorId}/{date}")
    public ResponseEntity<List<DoctorScheduleDTO>> getDoctorAvailableSlots(@PathVariable Integer doctorId, @PathVariable String date) {
        List<DoctorScheduleDTO> availableSlots = doctorClient.getDoctorAvailableSlots(doctorId, date);
        return ResponseEntity.ok(availableSlots);
    }

}
