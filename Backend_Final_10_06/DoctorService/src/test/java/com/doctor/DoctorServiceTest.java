package com.doctor;
 
import com.doctor.entity.DoctorEntity;
import com.doctor.repo.DoctorRepository;
import com.doctor.service.Impl.DoctorServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
 
class DoctorServiceTest {
 
    @InjectMocks
    private DoctorServiceImpl doctorService;
 
    @Mock
    private DoctorRepository doctorRepository;
 
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
 
    @Test
    void testCreateDoctor_validDoctor_success() {
        DoctorEntity doctor = DoctorEntity.builder()
                .name("John")
                .specialization("Cardiology")
                .email("john@example.com")
                .phone("123-456-7890")
                .build();
 
        when(doctorRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(doctorRepository.existsByPhone("123-456-7890")).thenReturn(false);
        when(doctorRepository.save(any())).thenReturn(doctor);
 
        DoctorEntity result = doctorService.createDoctor(doctor);
 
        assertEquals("John", result.getName());
        verify(doctorRepository).save(doctor);
    }
}
 
 