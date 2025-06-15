package com.medicalhistoryservice.repository;

import com.medicalhistoryservice.entity.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Integer> {
    List<MedicalHistory> findByPatientId(Integer patientId);
//    boolean existsByPatientIdAndDiagnosisAndTreatment(Integer patientId, String diagnosis, String treatment);
	boolean existsByPatientIdAndDateOfVisit(Integer patientId, LocalDate dateOfVisit);
    boolean existsByPatientIdAndDateOfVisitAndDiagnosis(Integer patientId, LocalDate dateOfVisit, String diagnosis);
}
