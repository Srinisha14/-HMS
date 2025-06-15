package com.patient.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.patient.entities.Patient;
import com.patient.entities.dto.AppointmentDTO;
import com.patient.entities.dto.MedicalHistoryDTO;
import com.patient.entities.dto.PatientDTO;
import com.patient.exception.InvalidBloodGroupException;
import com.patient.exception.InvalidPatientIdException;
import com.patient.exception.InvalidPatientNameException;
import com.patient.exception.PatientNotFoundException;
import com.patient.feign.AppointmentClient;
import com.patient.feign.MedicalHistoryClient;
import com.patient.services.PatientService;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/patient")
public class PatientController {

    private final PatientService patientService;
    private final AppointmentClient appointmentServiceClient;
    private final MedicalHistoryClient medicalHistoryClient;
    
    public PatientController(PatientService patientService,
            AppointmentClient appointmentServiceClient,
            MedicalHistoryClient medicalHistoryClient) { 
    	this.patientService = patientService;
    	this.appointmentServiceClient = appointmentServiceClient;
    	this.medicalHistoryClient = medicalHistoryClient;
}
    
 // ...existing code...
    @GetMapping
    public ResponseEntity<List<PatientDTO>> getAllPatients() {
        List<Patient> patients = patientService.getAllPatients();
        
        List<PatientDTO> patientDTOs = patients.stream().map(patient -> {
            // Fetch appointments
            List<Integer> appointmentIds = appointmentServiceClient.getAppointmentsByPatientId(patient.getPatientId())
                    .stream().map(AppointmentDTO::getAppointmentId)
                    .collect(Collectors.toList());

            // Fetch medical history
            List<MedicalHistoryDTO> medicalHistories;
            try {
                medicalHistories = medicalHistoryClient.getMedicalHistoryByPatientId(patient.getPatientId());
                if (medicalHistories.isEmpty()) {
                    medicalHistories = List.of(new MedicalHistoryDTO(null, "No Medical History for this patient", "", null));
                }
            } catch (Exception e) {
                medicalHistories = List.of(new MedicalHistoryDTO(null, "No Medical History for this patient", "", null));
            }
            
            return new PatientDTO(
                    patient.getPatientId(),
                    patient.getName(),
                    patient.getEmail(),
                    patient.getContactNumber(),
                    patient.getGender(),
                    patient.getBloodGroup(),
                    patient.getDateOfBirth(), // Map dateOfBirth
                    patient.getAddress(), // Map address
                    appointmentIds,
                    medicalHistories
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(patientDTOs);
    }

    @GetMapping("/profile/{name}")
    public ResponseEntity<PatientDTO> getPatientProfileByName(@PathVariable String name) {
        Patient patient = patientService.findByName(name)
                .orElseThrow(() -> new PatientNotFoundException("Patient with name '" + name + "' not found."));

        // ✅ Fetch appointments separately using AppointmentService
        List<Integer> appointmentIds = appointmentServiceClient.getAppointmentsByPatientId(patient.getPatientId()).stream()
                .map(AppointmentDTO::getAppointmentId)
                .collect(Collectors.toList());

        // ✅ Fetch medical histories separately using MedicalHistoryService
        List<MedicalHistoryDTO> medicalHistories;// = medicalHistoryClient.getMedicalHistoryByPatientId(patient.getPatientId());
        try {
            medicalHistories = medicalHistoryClient.getMedicalHistoryByPatientId(patient.getPatientId());
            if (medicalHistories.isEmpty()) {
                medicalHistories = List.of(new MedicalHistoryDTO(null, "No Medical History for this patient", "", null));
            }
        } catch (Exception e) {
            medicalHistories = List.of(new MedicalHistoryDTO(null, "No Medical History for this patient", "", null));
        }
        // ✅ Return patient details along with appointments and medical history
        PatientDTO patientDTO = new PatientDTO(
                patient.getPatientId(),
                patient.getName(),
                patient.getEmail(),
                patient.getContactNumber(),
                patient.getGender(),
                patient.getBloodGroup(),
                patient.getDateOfBirth(),
                patient.getAddress(),
                appointmentIds,  // ✅ Include appointments
                medicalHistories // ✅ Include medical history
        );

        return ResponseEntity.ok(patientDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatientById(@PathVariable Integer id) {
        validatePatientId(id);

        Patient patient = patientService.getPatientById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with ID: " + id));

        List<AppointmentDTO> appointments = appointmentServiceClient.getAppointmentsByPatientId(id);
        List<Integer> appointmentIds = appointments.stream()
                .map(AppointmentDTO::getAppointmentId)
                .collect(Collectors.toList());
        
        List<MedicalHistoryDTO> medicalHistories;
        try {
            medicalHistories = medicalHistoryClient.getMedicalHistoryByPatientId(id);
            if (medicalHistories.isEmpty()) {
                medicalHistories = List.of(new MedicalHistoryDTO(null, "No Medical History for this patient", "", null));
            }
        } catch (Exception e) {
            medicalHistories = List.of(new MedicalHistoryDTO(null, "No Medical History for this patient", "", null));
        }
        PatientDTO patientDTO = new PatientDTO(
        		patient.getPatientId(),
                patient.getName(),
                patient.getEmail(),
                patient.getContactNumber(),
                patient.getGender(),
                patient.getBloodGroup(),
                patient.getDateOfBirth(), // Map dateOfBirth
                patient.getAddress(), // Map address
                appointmentIds,
                medicalHistories
        );

        return ResponseEntity.ok(patientDTO);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Patient> getPatientByEmail(@PathVariable String email) {
        Patient patient = patientService.findByEmail(email)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with email: " + email));
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/contact/{contactNumber}")
    public ResponseEntity<Patient> getPatientByContactNumber(@PathVariable String contactNumber) {
        Patient patient = patientService.findByContactNumber(contactNumber)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with contact number: " + contactNumber));
        return ResponseEntity.ok(patient);
    }
    @GetMapping("/ownprofile/{name}")
    public ResponseEntity<PatientDTO> getPatientOwnProfileByName(@PathVariable String name) {
        Patient patient = patientService.findByName(name)
                .orElseThrow(() -> new PatientNotFoundException("Patient with name '" + name + "' not found."));
 
       
        // ✅ Return patient details along with appointments and medical history
        PatientDTO patientDTO = new PatientDTO(
                patient.getPatientId(),
                patient.getName(),
                patient.getEmail(),
                patient.getContactNumber(),
                patient.getGender(),
                patient.getBloodGroup(),
                patient.getDateOfBirth(),
                patient.getAddress(),
                null,null // ✅ Include medical history
        );
 
        return ResponseEntity.ok(patientDTO);
    }
 
    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        validatePatientDetails(patient);

        if (patientService.isPatientRegistered(patient.getEmail(), patient.getContactNumber())) {
            throw new IllegalArgumentException("Patient with this email or contact number is already registered.");
        }

        Patient savedPatient = patientService.createPatient(patient);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPatient);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Integer id) {
        validatePatientId(id);

        if (!patientService.existsById(id)) {
            throw new PatientNotFoundException("Patient with ID " + id + " does not exist.");
        }
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Integer id, @RequestBody Patient patientProfile) {
        validatePatientId(id);
        validatePatientDetails(patientProfile);

        Patient existingPatient = patientService.getPatientById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient with ID " + id + " not found."));

        existingPatient.setName(patientProfile.getName());
        existingPatient.setEmail(patientProfile.getEmail());
        existingPatient.setContactNumber(patientProfile.getContactNumber());
        existingPatient.setGender(patientProfile.getGender());
        existingPatient.setAddress(patientProfile.getAddress());
        existingPatient.setDateOfBirth(patientProfile.getDateOfBirth());
        existingPatient.setBloodGroup(patientProfile.getBloodGroup());

        return ResponseEntity.ok(patientService.updatePatient(id, existingPatient).get());
    }

    //  Centralized validation methods
    private void validatePatientId(Integer id) {
        if (id == null || id <= 0) {
            throw new InvalidPatientIdException("Invalid Patient ID: " + id);
        }
    }

    private void validatePatientDetails(Patient patient) {
        if (patient.getName() == null || patient.getName().trim().isEmpty()) {
            throw new InvalidPatientNameException("Patient name cannot be empty.");
        }
        if (!patientService.isValidBloodGroup(patient.getBloodGroup())) {
            throw new InvalidBloodGroupException("Invalid blood group: " + patient.getBloodGroup());
        }
    }
}
