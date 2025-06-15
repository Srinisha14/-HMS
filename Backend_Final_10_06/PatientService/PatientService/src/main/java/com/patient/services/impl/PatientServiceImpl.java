package com.patient.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.patient.entities.Patient;
import com.patient.exception.CustomNotFoundException;
import com.patient.exception.InvalidBloodGroupException;
import com.patient.exception.InvalidPatientNameException;
import com.patient.exception.PatientNotFoundException;
import com.patient.repositories.PatientRepository;
import com.patient.services.PatientService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    private static final List<String> VALID_BLOOD_GROUPS = List.of("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-");

    public PatientServiceImpl(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public List<Patient> getAllPatients() {
        log.info("Fetching all patients...");
        List<Patient> patients = patientRepository.findAll();
        if (patients.isEmpty()) {
            log.warn("No patients found in the database.");
            throw new CustomNotFoundException("No patients exist in the database.");
        }
        log.info("Successfully fetched {} patients.", patients.size());
        return patients;
    }

    @Override
    public Optional<Patient> getPatientById(Integer id) {
        log.info("Fetching patient with ID: {}", id);
        return Optional.ofNullable(patientRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Patient not found with ID: {}", id);
                    return new PatientNotFoundException("Patient not found with ID: " + id);
                }));
    }

    @Override
    public Optional<Patient> findByEmail(String email) {
        log.info("Fetching patient with email: {}", email);
        return Optional.ofNullable(patientRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("Patient not found with email: {}", email);
                    return new PatientNotFoundException("Patient not found with email: " + email);
                }));
    }

    @Override
    public Optional<Patient> findByContactNumber(String contactNumber) {
        log.info("Fetching patient with contact number: {}", contactNumber);
        return Optional.ofNullable(patientRepository.findByContactNumber(contactNumber)
                .orElseThrow(() -> {
                    log.error("Patient not found with contact number: {}", contactNumber);
                    return new PatientNotFoundException("Patient not found with contact number: " + contactNumber);
                }));
    }

    @Override
    public Patient createPatient(Patient patient) {
        log.info("Creating new patient: {}", patient);
        validatePatientDetails(patient);
        Patient savedPatient = patientRepository.save(patient);
        log.info("Patient successfully created with ID: {}", savedPatient.getPatientId());
        return savedPatient;
    }

    @Override
    public void deletePatient(Integer id) {
        log.info("Attempting to delete patient with ID: {}", id);
        if (!existsById(id)) {
            log.error("Deletion failed, patient with ID {} does not exist.", id);
            throw new PatientNotFoundException("Patient with ID " + id + " does not exist.");
        }
        patientRepository.deleteById(id);
        log.info("Patient with ID {} successfully deleted.", id);
    }

    @Override
    public Optional<Patient> updatePatient(Integer id, Patient patient) {
        log.info("Updating patient with ID: {}", id);
        Patient existingPatient = patientRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Patient with ID {} not found for update.", id);
                    return new PatientNotFoundException("Patient with ID " + id + " not found.");
                });

        existingPatient.setName(patient.getName());
        existingPatient.setEmail(patient.getEmail());
        existingPatient.setContactNumber(patient.getContactNumber());
        existingPatient.setGender(patient.getGender());
        existingPatient.setAddress(patient.getAddress());
        existingPatient.setDateOfBirth(patient.getDateOfBirth());
        existingPatient.setBloodGroup(patient.getBloodGroup());

        Patient updatedPatient = patientRepository.save(existingPatient);
        log.info("Patient with ID {} successfully updated.", id);

        return Optional.of(updatedPatient);
    }

    @Override
    public boolean existsById(Integer id) {
        boolean exists = patientRepository.existsById(id);
        log.debug("Checking existence of patient with ID {}: {}", id, exists);
        return exists;
    }

    @Override
    public boolean isValidBloodGroup(String bloodGroup) {
        boolean valid = VALID_BLOOD_GROUPS.contains(bloodGroup);
        log.debug("Validating blood group {}: {}", bloodGroup, valid);
        return valid;
    }

    @Override
    public boolean isPatientRegistered(String email, String contactNumber) {
        boolean registered = patientRepository.existsByEmail(email) || patientRepository.existsByContactNumber(contactNumber);
        log.debug("Checking if patient is registered with email {} or contact number {}: {}", email, contactNumber, registered);
        return registered;
    }
    
    @Override
    public Optional<Patient> findByName(String name) {
        return patientRepository.findByName(name);
    }

    // Centralized validation method to reduce redundancy
    private void validatePatientDetails(Patient patient) {
        if (patient.getName() == null || patient.getName().trim().isEmpty()) {
            log.warn("Invalid patient name provided.");
            throw new InvalidPatientNameException("Patient name cannot be empty.");
        }
        if (isPatientRegistered(patient.getEmail(), patient.getContactNumber())) {
            log.warn("Attempt to register duplicate patient with email: {} or contact number: {}", patient.getEmail(), patient.getContactNumber());
            throw new IllegalArgumentException("Patient with this email or contact number is already registered.");
        }
        if (!isValidBloodGroup(patient.getBloodGroup())) {
            log.warn("Invalid blood group provided: {}", patient.getBloodGroup());
            throw new InvalidBloodGroupException("Invalid blood group: " + patient.getBloodGroup());
        }
    }
}