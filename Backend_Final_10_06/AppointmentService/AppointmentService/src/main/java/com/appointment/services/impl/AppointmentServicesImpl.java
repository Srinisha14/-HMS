package com.appointment.services.impl;

import com.appointment.entities.Appointment;
import com.appointment.entities.dto.DoctorDTO;
import com.appointment.entities.dto.PatientDTO;
import com.appointment.feign.DoctorClient;
import com.appointment.feign.NotificationClient;
import com.appointment.feign.PatientClient;
import com.appointment.repository.AppointmentRepository;
import com.appointment.services.AppointmentServices;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Slf4j // Enables logging
public class AppointmentServicesImpl implements AppointmentServices {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorClient doctorClient;

    @Autowired
    private PatientClient patientClient;

    @Autowired
    private NotificationClient notificationClient;

    @Override
    public List<Appointment> getAllAppointments() {
        log.info("Fetching all appointments...");
        List<Appointment> appointments = appointmentRepository.findAll();
        log.info("Successfully fetched {} appointments.", appointments.size());
        return appointments;
    }

    @Override
    public Appointment getAppointmentById(Integer id) {
        log.info("Fetching appointment with ID: {}", id);
        return appointmentRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Appointment not found with ID: {}", id);
                    return new IllegalStateException("Appointment not found.");
                });
    }

    @Override
    public Appointment createAppointment(Appointment appointment) {
        log.info("Creating appointment for Doctor ID: {}, Patient ID: {}", appointment.getDoctorId(), appointment.getPatientId());

        LocalDate appointmentDate = appointment.getAppointmentDate();
        LocalTime appointmentTime = appointment.getAppointmentTime();
        Integer doctorId = appointment.getDoctorId();
        Integer patientId = appointment.getPatientId();

        if (appointmentDate.isBefore(LocalDate.now()) || 
            (appointmentDate.isEqual(LocalDate.now()) && appointmentTime.isBefore(LocalTime.now()))) {
            log.warn("Invalid appointment date/time: {} {}", appointmentDate, appointmentTime);
            throw new IllegalArgumentException("Cannot book an appointment in the past.");
        }

        if (appointment.getReason() == null || appointment.getReason().trim().isEmpty()) {
            log.warn("Missing appointment reason.");
            throw new IllegalArgumentException("Appointment reason is required.");
        }

        DoctorDTO doctor = doctorClient.getDoctorById(doctorId);
        if (doctor == null) {
            log.error("Doctor with ID {} not found.", doctorId);
            throw new IllegalStateException("Doctor not found.");
        }

        String formattedDate = appointmentDate.toString();
        String formattedTime = appointmentTime.format(DateTimeFormatter.ofPattern("HH:mm"));

        if (!doctorClient.isDoctorAvailable(doctorId, formattedDate, formattedTime)) {
            log.warn("Doctor ID {} is unavailable at {} {}", doctorId, formattedDate, formattedTime);
            throw new IllegalStateException("Doctor is unavailable at the selected time.");
        }

        if (appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTime(doctorId, appointmentDate, appointmentTime)) {
            log.warn("Doctor ID {} already booked at {} {}", doctorId, formattedDate, formattedTime);
            throw new IllegalStateException("Doctor is already booked at this time.");
        }

        PatientDTO patient = patientClient.getPatientById(patientId);
        if (patient == null) {
            log.error("Patient with ID {} not found.", patientId);
            throw new IllegalStateException("Patient not found.");
        }

        if (appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTime(patientId, appointmentDate, appointmentTime)) {
            log.warn("Patient ID {} already has an appointment at {} {}", patientId, formattedDate, formattedTime);
            throw new IllegalStateException("Patient already has an appointment at this time.");
        }

        Appointment savedAppointment = appointmentRepository.save(appointment);
        log.info("Appointment successfully created with ID: {}", savedAppointment.getAppointmentId());

        notificationClient.sendAppointmentNotification(savedAppointment.getAppointmentId(), savedAppointment.getDoctorId(), savedAppointment.getPatientId());
        log.info("Notification sent successfully for appointment ID: {}", savedAppointment.getAppointmentId());

        return savedAppointment;
    }

    @Override
    public Appointment updateAppointment(Integer id, Appointment newAppointment) {
        log.info("Updating appointment with ID: {}", id);
        return appointmentRepository.findById(id).map(existing -> {
            LocalDate appointmentDate = newAppointment.getAppointmentDate();
            LocalTime appointmentTime = newAppointment.getAppointmentTime();
            Integer doctorId = newAppointment.getDoctorId();
            Integer patientId = newAppointment.getPatientId();

            PatientDTO patient = patientClient.getPatientById(patientId);
            if (patient == null) {
                log.error("Patient with ID {} not found in PatientService.", patientId);
                throw new IllegalStateException("Patient not found in PatientService.");
            }

            DoctorDTO doctor = doctorClient.getDoctorById(doctorId);
            if (doctor == null) {
                log.error("Doctor with ID {} not found in DoctorService.", doctorId);
                throw new IllegalStateException("Doctor not found in DoctorService.");
            }

            if (appointmentDate.isBefore(LocalDate.now()) || 
                (appointmentDate.isEqual(LocalDate.now()) && appointmentTime.isBefore(LocalTime.now()))) {
                log.warn("Cannot update appointment to a past date/time: {} {}", appointmentDate, appointmentTime);
                throw new IllegalArgumentException("Cannot update an appointment to a past date/time.");
            }

            String formattedDate = appointmentDate.toString();
            String formattedTime = appointmentTime.format(DateTimeFormatter.ofPattern("HH:mm"));

            if (!doctorClient.isDoctorAvailable(doctorId, formattedDate, formattedTime)) {
                log.warn("Doctor ID {} is unavailable at {} {}", doctorId, formattedDate, formattedTime);
                throw new IllegalStateException("Doctor is unavailable at the selected time.");
            }

            existing.setAppointmentDate(newAppointment.getAppointmentDate());
            existing.setAppointmentTime(newAppointment.getAppointmentTime());
            existing.setStatus(newAppointment.getStatus());
            existing.setPatientId(newAppointment.getPatientId());
            existing.setDoctorId(newAppointment.getDoctorId());
            existing.setScheduleId(newAppointment.getScheduleId());

            if (newAppointment.getReason() != null && !newAppointment.getReason().trim().isEmpty()) {
                existing.setReason(newAppointment.getReason());
            }

            Appointment updatedAppointment = appointmentRepository.save(existing);
            log.info("Appointment updated successfully with ID: {}", updatedAppointment.getAppointmentId());

            return updatedAppointment;
        }).orElse(null);
    }

    @Override
    public void deleteAppointment(Integer id) {
        log.info("Attempting to delete appointment with ID: {}", id);
        Appointment existing = appointmentRepository.findById(id).orElse(null);
        if (existing == null) {
            log.error("Appointment deletion failed, ID {} does not exist.", id);
            throw new IllegalStateException("Appointment not found.");
        }

        notificationClient.sendCancellationEmail(
                doctorClient.getDoctorById(existing.getDoctorId()).getEmail(),
                patientClient.getPatientById(existing.getPatientId()).getEmail()
        );

        appointmentRepository.deleteById(id);
        log.info("Appointment successfully deleted with ID: {}", id);
    }

    @Override
    public List<Appointment> getAppointmentsByPatientId(Integer patientId) {
        log.info("Fetching appointments for patient ID: {}", patientId);
        return appointmentRepository.findByPatientId(patientId);
    }

    @Override
    public List<Appointment> getAppointmentsByDoctorId(Integer doctorId) {
        log.info("Fetching appointments for doctor ID: {}", doctorId);
        return appointmentRepository.findByDoctorId(doctorId);
    }
}
