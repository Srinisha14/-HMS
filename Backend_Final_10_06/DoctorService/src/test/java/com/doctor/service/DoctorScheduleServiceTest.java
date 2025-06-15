package com.doctor.service;
 
import com.doctor.entity.DoctorEntity;
import com.doctor.entity.DoctorSchedule;
import com.doctor.repo.DoctorRepository;
import com.doctor.repo.DoctorScheduleRepository;
import com.doctor.service.Impl.DoctorScheduleServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
 
import java.time.LocalDate;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
 
class DoctorScheduleServiceTest {
 
    @InjectMocks
    private DoctorScheduleServiceImpl doctorScheduleService;
 
    @Mock
    private DoctorScheduleRepository doctorScheduleRepository;
 
    @Mock
    private DoctorRepository doctorRepository;
 
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
 
    @Test
    void testCreateSchedule_validSchedule_success() {
        DoctorEntity doctor = DoctorEntity.builder()
                .doctorId(1)
                .name("Dr. Smith")
                .specialization("Cardiology")
                .build();
 
        DoctorSchedule schedule = DoctorSchedule.builder()
                .doctor(doctor)
                .availableTimeSlots("10:00 AM - 12:00 PM")
                .date(LocalDate.now().plusDays(1))
                .build();
 
        when(doctorRepository.existsById(1)).thenReturn(true);
        when(doctorScheduleRepository.findByDoctorAndDateAndAvailableTimeSlots(
                any(), any(), any())).thenReturn(java.util.Optional.empty());
        when(doctorScheduleRepository.save(any())).thenReturn(schedule);
 
        DoctorSchedule result = doctorScheduleService.createSchedule(schedule);
 
        assertEquals("10:00 AM - 12:00 PM", result.getAvailableTimeSlots());
        verify(doctorScheduleRepository).save(schedule);
    }
}
 
 