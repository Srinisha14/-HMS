package com.patient.repositories;

import com.patient.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Integer> {

    //  Checks if an email is already registered
    boolean existsByEmail(String email);

    //  Checks if a contact number is already registered
    boolean existsByContactNumber(String contactNumber);

    //  Directly verifies if a patient exists by ID
    boolean existsById(Integer id);

    //  Corrected return type from `Optional<Object>` → `Optional<Patient>`
    Optional<Patient> findByEmail(String email);

    //  Added method to find a patient by contact number
    Optional<Patient> findByContactNumber(String contactNumber);
    
    Optional<Patient> findByName(String name);
}
