package com.doctor.service.Impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.doctor.DoctorExceptions.DoctorNotFoundException;
import com.doctor.DoctorExceptions.DuplicateDoctorException;
import com.doctor.DoctorExceptions.InvalidEmailFormatException;
import com.doctor.DoctorExceptions.InvalidPhoneNumberException;
import com.doctor.entity.DoctorEntity;
import com.doctor.repo.DoctorRepository;
import com.doctor.service.DoctorService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j // Enables logging
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public List<DoctorEntity> getAllDoctors() {
        log.info("Fetching all doctors...");
        List<DoctorEntity> doctors = doctorRepository.findAll();
        log.info("Successfully fetched {} doctors.", doctors.size());
        return doctors;
    }

    @Override
    public DoctorEntity getDoctorById(Integer id) {
        log.info("Fetching doctor with ID: {}", id);
        return doctorRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Doctor not found with ID: {}", id);
                    return new DoctorNotFoundException("Doctor not found with ID: " + id);
                });
    }

    @Override
    public DoctorEntity createDoctor(DoctorEntity doctor) {
        log.info("Creating new doctor: {}", doctor.getName());

        if (doctor.getName() == null || doctor.getName().isBlank()) {
            log.warn("Doctor name validation failed.");
            throw new IllegalArgumentException("Doctor name is required.");
        }
        if (doctor.getSpecialization() == null || doctor.getSpecialization().isBlank()) {
            log.warn("Doctor specialization validation failed.");
            throw new IllegalArgumentException("Specialization is required.");
        }
        if (doctor.getEmail() == null || doctor.getEmail().isBlank()) {
            log.warn("Doctor email validation failed.");
            throw new IllegalArgumentException("Email is required.");
        }
        if (doctor.getPhone() == null || doctor.getPhone().isBlank()) {
            log.warn("Doctor phone validation failed.");
            throw new IllegalArgumentException("Contact number is required.");
        }

        if (doctorRepository.existsByEmail(doctor.getEmail())) {
            log.warn("Duplicate email detected for doctor: {}", doctor.getEmail());
            throw new DuplicateDoctorException("A doctor with this email already exists.");
        }

        if (doctorRepository.existsByPhone(doctor.getPhone())) {
            log.warn("Duplicate phone number detected for doctor: {}", doctor.getPhone());
            throw new DuplicateDoctorException("A doctor with this contact number already exists.");
        }

        if (!doctor.getEmail().matches("^[\\w.-]+@[\\w.-]+\\.\\w{2,}$")) {
            log.warn("Invalid email format detected: {}", doctor.getEmail());
            throw new InvalidEmailFormatException("Invalid email format.");
        }

        if (!doctor.getPhone().matches("^\\d{3}-\\d{3}-\\d{4}$")) {
            log.warn("Invalid phone number format detected: {}", doctor.getPhone());
            throw new InvalidPhoneNumberException("Invalid phone number format. Expected format: 123-456-7890");
        }

        DoctorEntity savedDoctor = doctorRepository.save(doctor);
        log.info("Doctor successfully created with ID: {}", savedDoctor.getDoctorId());
        return savedDoctor;
    }

    @Override
    public DoctorEntity deleteDoctorById(Integer id) {
        log.info("Attempting to delete doctor with ID: {}", id);
        DoctorEntity doctor = doctorRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Doctor not found for deletion, ID: {}", id);
                    return new DoctorNotFoundException("Doctor not found with ID: " + id);
                });
        doctorRepository.delete(doctor);
        log.info("Doctor successfully deleted with ID: {}", id);
        return doctor;
    }

    @Override
    public DoctorEntity deleteDoctorByName(String name) {
        log.info("Attempting to delete doctor with name: {}", name);
        DoctorEntity doctor = doctorRepository.findByName(name)
                .orElseThrow(() -> {
                    log.error("Doctor not found for deletion, Name: {}", name);
                    return new DoctorNotFoundException("Doctor not found with name: " + name);
                });
        doctorRepository.delete(doctor);
        log.info("Doctor successfully deleted with name: {}", name);
        return doctor;
    }

    @Override
    public DoctorEntity updateDoctor(Integer id, DoctorEntity doctor) {
        log.info("Updating doctor with ID: {}", id);
        DoctorEntity existingDoctor = doctorRepository.findById(id).orElse(null);
        if (existingDoctor != null) {
            existingDoctor.setName(doctor.getName());
            existingDoctor.setSpecialization(doctor.getSpecialization());
            existingDoctor.setPhone(doctor.getPhone());
            existingDoctor.setEmail(doctor.getEmail());

            DoctorEntity updatedDoctor = doctorRepository.save(existingDoctor);
            log.info("Doctor successfully updated with ID: {}", id);
            return updatedDoctor;
        } else {
            log.warn("Doctor not found for update with ID: {}", id);
            return null;
        }
    }

    @Override
    public void deleteDoctor(Integer id) {
        log.info("Deleting doctor with ID: {}", id);
        doctorRepository.deleteById(id);
        log.info("Doctor deleted successfully with ID: {}", id);
    }

    @Override
    public DoctorEntity getDoctorByName(String name) {
        log.info("Fetching doctor by name: {}", name);
        return doctorRepository.findByName(name)
                .orElseThrow(() -> {
                    log.error("Doctor not found with name: {}", name);
                    return new DoctorNotFoundException("No doctor found with name: " + name);
                });
    }

    @Override
    public DoctorEntity getDoctorByEmail(String email) {
        log.info("Fetching doctor by email: {}", email);
        return doctorRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("Doctor not found with email: {}", email);
                    return new DoctorNotFoundException("Doctor not found with email: " + email);
                });
    }

    @Override
    public List<DoctorEntity> getDoctorBySpecialization(String specialization) {
        log.info("Fetching doctors by specialization: {}", specialization);
        List<DoctorEntity> doctors = doctorRepository.findBySpecialization(specialization);

        if (doctors.isEmpty()) {
            log.warn("No doctors found with specialization: {}", specialization);
            throw new DoctorNotFoundException("No doctors found with specialization: " + specialization);
        }

        log.info("Successfully fetched {} doctors with specialization: {}", doctors.size(), specialization);
        return doctors;
    }
}
