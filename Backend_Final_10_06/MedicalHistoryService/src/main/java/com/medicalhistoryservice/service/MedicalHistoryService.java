package com.medicalhistoryservice.service;

import com.medicalhistoryservice.entity.dto.AppointmentDTO;
import com.medicalhistoryservice.entity.dto.MedicalHistoryDTO;
import com.medicalhistoryservice.entity.dto.PatientDTO;
import java.util.List;
import java.util.Optional;

public interface MedicalHistoryService {

    List<MedicalHistoryDTO> getAllMedicalHistories();
    Optional<MedicalHistoryDTO> getMedicalHistoryById(Integer id);
    MedicalHistoryDTO createMedicalHistory(MedicalHistoryDTO medicalHistoryDTO);
    Optional<MedicalHistoryDTO> updateMedicalHistory(Integer id, MedicalHistoryDTO updatedMedicalHistoryDTO);
    void deleteMedicalHistory(Integer id);
    List<MedicalHistoryDTO> getMedicalHistoriesByPatientId(Integer patientId);
    Optional<PatientDTO> getValidPatient(Integer patientId);
    
    List<AppointmentDTO> getAppointmentsByPatientId(Integer patientId);
    
    boolean isDuplicateEntry(MedicalHistoryDTO medicalHistoryDTO);
    boolean validateMandatoryFields(MedicalHistoryDTO medicalHistoryDTO);
}
