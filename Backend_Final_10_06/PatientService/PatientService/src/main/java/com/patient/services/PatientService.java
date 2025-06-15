package com.patient.services;

import com.patient.entities.Patient;
import java.util.List;
import java.util.Optional;

public interface PatientService {
    List<Patient> getAllPatients();
    Optional<Patient> getPatientById(Integer id);
    Patient createPatient(Patient patient);
    void deletePatient(Integer id);
    Optional<Patient> updatePatient(Integer id, Patient patient);

    // Validation methods
    boolean existsById(Integer id);
    boolean isValidBloodGroup(String bloodGroup);
    boolean isPatientRegistered(String email, String contactNumber);
    Optional<Patient> findByEmail(String email);
    Optional<Patient> findByContactNumber(String contactNumber); //
    
    Optional<Patient> findByName(String name);
}
