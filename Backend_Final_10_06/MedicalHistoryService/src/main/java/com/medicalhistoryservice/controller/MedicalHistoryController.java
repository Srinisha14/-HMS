package com.medicalhistoryservice.controller;

import com.medicalhistoryservice.entity.dto.MedicalHistoryDTO;
import com.medicalhistoryservice.exceptions.CustomNotFoundException;
import com.medicalhistoryservice.service.MedicalHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
 
import java.util.List;
 
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/medical-history")
public class MedicalHistoryController {
 
    private final MedicalHistoryService medicalHistoryService;
 
    public MedicalHistoryController(MedicalHistoryService medicalHistoryService) {
        this.medicalHistoryService = medicalHistoryService;
    }
 
    @GetMapping
    public ResponseEntity<List<MedicalHistoryDTO>> getAllHistories() {
        return ResponseEntity.ok(medicalHistoryService.getAllMedicalHistories());
    }
 
    @GetMapping("/{id}")
    public ResponseEntity<MedicalHistoryDTO> getHistoryById(@PathVariable Integer id) {
        return medicalHistoryService.getMedicalHistoryById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new CustomNotFoundException("Medical history with ID " + id + " not found"));
    }
 
     @PostMapping
     public ResponseEntity<MedicalHistoryDTO> createHistory(@RequestBody MedicalHistoryDTO historyDTO) {
 
        MedicalHistoryDTO created = medicalHistoryService.createMedicalHistory(historyDTO);
        return ResponseEntity.ok(created);
    }
 
 
    @PutMapping("/{id}")
    public ResponseEntity<MedicalHistoryDTO> updateHistory(@PathVariable Integer id, @RequestBody MedicalHistoryDTO updatedHistoryDTO) {
        return medicalHistoryService.updateMedicalHistory(id, updatedHistoryDTO)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new CustomNotFoundException("Medical history with ID " + id + " not found for update"));
    }
 
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHistory(@PathVariable Integer id) {
        medicalHistoryService.deleteMedicalHistory(id);
        return ResponseEntity.ok("Medical history deleted successfully");
    }
 
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalHistoryDTO>> getByPatientId(@PathVariable Integer patientId) {
        List<MedicalHistoryDTO> histories = medicalHistoryService.getMedicalHistoriesByPatientId(patientId);
        if (histories.isEmpty()) {
            throw new CustomNotFoundException("No medical history found for patient ID " + patientId);
        }
        return ResponseEntity.ok(histories);
    }
}