package com.patient.services;
 
import com.patient.entities.Patient;
import com.patient.exception.InvalidBloodGroupException;
import com.patient.exception.InvalidPatientNameException;
import com.patient.repositories.PatientRepository;
import com.patient.services.impl.PatientServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
 
import java.util.Date;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
 
class PatientServiceTest {
 
    @InjectMocks
    private PatientServiceImpl patientService;
 
    @Mock
    private PatientRepository patientRepository;
 
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
 
    @Test
    void testCreatePatient_validPatient_success() {
        Patient patient = Patient.builder()
                .name("Alice")
                .email("alice@example.com")
                .contactNumber("9876543210")
                .gender("Female")
                .address("123 Main Street")
                .dateOfBirth(new Date())
                .bloodGroup("A+")
                .build();
 
        when(patientRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(patientRepository.existsByContactNumber("9876543210")).thenReturn(false);
        when(patientRepository.save(any())).thenReturn(patient);
 
        Patient result = patientService.createPatient(patient);
 
        assertEquals("Alice", result.getName());
        verify(patientRepository).save(patient);
    }
}