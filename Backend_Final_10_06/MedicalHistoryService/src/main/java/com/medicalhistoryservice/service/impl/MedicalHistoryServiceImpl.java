package com.medicalhistoryservice.service.impl;

import com.medicalhistoryservice.client.AppointmentClient;
import com.medicalhistoryservice.client.PatientClient;
import com.medicalhistoryservice.entity.MedicalHistory;
import com.medicalhistoryservice.entity.dto.AppointmentDTO;
import com.medicalhistoryservice.entity.dto.MedicalHistoryDTO;
import com.medicalhistoryservice.entity.dto.PatientDTO;
import com.medicalhistoryservice.exceptions.DuplicateEntryException;
import com.medicalhistoryservice.exceptions.InvalidInputException;
import com.medicalhistoryservice.repository.MedicalHistoryRepository;
import com.medicalhistoryservice.service.MedicalHistoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j // Enables logging
public class MedicalHistoryServiceImpl implements MedicalHistoryService {

    private final MedicalHistoryRepository repository;

    @Autowired
    private PatientClient patientClient;

    @Autowired
    private AppointmentClient appointmentClient;

    public MedicalHistoryServiceImpl(MedicalHistoryRepository repository) {
        this.repository = repository;
    }

    private MedicalHistoryDTO convertToDTO(MedicalHistory mh) {
        return new MedicalHistoryDTO(
                mh.getHistoryId(),
                mh.getDiagnosis(),
                mh.getTreatment(),
                mh.getDateOfVisit(),
                mh.getPatientId()
        );
    }

    private MedicalHistory convertToEntity(MedicalHistoryDTO dto) {
        return new MedicalHistory(dto.getHistoryId(), dto.getDiagnosis(), dto.getTreatment(), dto.getDateOfVisit(), dto.getPatientId());
    }

    @Override
    public List<MedicalHistoryDTO> getAllMedicalHistories() {
        log.info("Fetching all medical history records...");
        return repository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<MedicalHistoryDTO> getMedicalHistoryById(Integer id) {
        log.info("Fetching medical history for ID: {}", id);
        return repository.findById(id).map(this::convertToDTO);
    }

    @Override
    public MedicalHistoryDTO createMedicalHistory(MedicalHistoryDTO medicalHistoryDTO) {
        log.info("Creating medical history for patient ID: {}", medicalHistoryDTO.getPatientId());

        if (!validateMandatoryFields(medicalHistoryDTO)) {
            log.warn("Validation failed: Mandatory fields are missing.");
            throw new InvalidInputException("Mandatory fields are missing.");
        }

        if (isDuplicateEntry(medicalHistoryDTO)) {
            log.warn("Duplicate entry detected for patient ID: {}", medicalHistoryDTO.getPatientId());
            throw new DuplicateEntryException("Duplicate entry, If diagnosis modified kindly update it");
        }

        MedicalHistory saved = repository.save(convertToEntity(medicalHistoryDTO));
        log.info("Medical history successfully created with ID: {}", saved.getHistoryId());
        return convertToDTO(saved);
    }

    @Override
    public Optional<MedicalHistoryDTO> updateMedicalHistory(Integer id, MedicalHistoryDTO updatedMedicalHistoryDTO) {
        log.info("Updating medical history for ID: {}", id);
        return repository.findById(id).map(existing -> {
            existing.setDiagnosis(updatedMedicalHistoryDTO.getDiagnosis());
            existing.setTreatment(updatedMedicalHistoryDTO.getTreatment());
            existing.setDateOfVisit(updatedMedicalHistoryDTO.getDateOfVisit());
            MedicalHistory saved = repository.save(existing);
            log.info("Medical history successfully updated with ID: {}", id);
            return convertToDTO(saved);
        });
    }

    @Override
    public void deleteMedicalHistory(Integer id) {
        log.info("Attempting to delete medical history with ID: {}", id);
        if (!repository.existsById(id)) {
            log.error("Medical history deletion failed, ID {} does not exist.", id);
            throw new IllegalArgumentException("Medical history with ID " + id + " does not exist.");
        }
        repository.deleteById(id);
        log.info("Medical history successfully deleted with ID: {}", id);
    }

    @Override
    public List<MedicalHistoryDTO> getMedicalHistoriesByPatientId(Integer patientId) {
        log.info("Fetching medical histories for patient ID: {}", patientId);
        return repository.findByPatientId(patientId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<PatientDTO> getValidPatient(Integer patientId) {
        log.info("Fetching patient details for patient ID: {}", patientId);
        try {
            ResponseEntity<PatientDTO> response = patientClient.getPatientById(patientId);
            if (response != null && response.getBody() != null) {
                log.info("Patient found: {}", response.getBody());
                return Optional.of(response.getBody());
            } else {
                log.warn("Patient ID {} not found in PatientService.", patientId);
                return Optional.empty();
            }
        } catch (Exception e) {
            log.error("Error fetching patient ID {}: {}", patientId, e.getMessage(), e);
            return Optional.empty();
        }
    }

    @Override
    public boolean isDuplicateEntry(MedicalHistoryDTO medicalHistoryDTO) {
        boolean duplicate = repository.existsByPatientIdAndDateOfVisit(
                medicalHistoryDTO.getPatientId(),
                medicalHistoryDTO.getDateOfVisit()
        );
        log.debug("Checking duplicate entry for patient ID {} on {}: {}", medicalHistoryDTO.getPatientId(), medicalHistoryDTO.getDateOfVisit(), duplicate);
        return duplicate;
    }

    @Override
    public boolean validateMandatoryFields(MedicalHistoryDTO mh) {
        boolean valid = mh.getDiagnosis() != null &&
                mh.getTreatment() != null &&
                mh.getDateOfVisit() != null &&
                mh.getPatientId() != null;
        log.debug("Validating mandatory fields for medical history: {}", valid);
        return valid;
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByPatientId(Integer patientId) {
        log.info("Fetching appointments for patient ID: {}", patientId);
        return appointmentClient.getAppointmentsByPatient(patientId);
    }
}
