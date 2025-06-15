package com.appointment.services;
 
import com.appointment.entities.Appointment;
import com.appointment.entities.dto.DoctorDTO;
import com.appointment.entities.dto.PatientDTO;
import com.appointment.feign.DoctorClient;
import com.appointment.feign.NotificationClient;
import com.appointment.feign.PatientClient;
import com.appointment.repository.AppointmentRepository;
import com.appointment.services.impl.AppointmentServicesImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
 
import java.time.LocalDate;
import java.time.LocalTime;
 
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
 
class AppointmentServiceTest {
 
    @InjectMocks
    private AppointmentServicesImpl appointmentService;
 
    @Mock
    private AppointmentRepository appointmentRepository;
 
    @Mock
    private DoctorClient doctorClient;
 
    @Mock
    private PatientClient patientClient;
 
    @Mock
    private NotificationClient notificationClient;
 
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    void testCreateAppointment_validAppointment_success() {
        Appointment appointment = Appointment.builder()
                .appointmentDate(LocalDate.now().plusDays(1))
                .appointmentTime(LocalTime.of(10, 0))
                .doctorId(1)
                .patientId(2)
                .reason("Routine checkup")
                .build();
 
        Appointment savedAppointment = Appointment.builder()
                .appointmentId(1001)
                .appointmentDate(appointment.getAppointmentDate())
                .appointmentTime(appointment.getAppointmentTime())
                .doctorId(1)
                .patientId(2)
                .reason("Routine checkup")
                .build();
 
        DoctorDTO doctor = DoctorDTO.builder().doctorId(1).name("Dr. Smith").build();
        PatientDTO patient = PatientDTO.builder().patientId(2).name("John Doe").build();
 
        when(doctorClient.getDoctorById(1)).thenReturn(doctor);
        when(doctorClient.isDoctorAvailable(eq(1), anyString(), anyString())).thenReturn(true);
        when(patientClient.getPatientById(2)).thenReturn(patient);
        when(appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTime(anyInt(), any(), any())).thenReturn(false);
        when(appointmentRepository.save(any())).thenReturn(savedAppointment);
 
        Appointment result = appointmentService.createAppointment(appointment);
 
        assertNotNull(result);
        assertEquals("Routine checkup", result.getReason());
        verify(notificationClient).sendAppointmentNotification(1001, 1, 2);
    }
 
 
   }
 
 