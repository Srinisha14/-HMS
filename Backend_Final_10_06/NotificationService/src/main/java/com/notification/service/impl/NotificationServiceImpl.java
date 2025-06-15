package com.notification.service.impl;

import com.notification.entity.NotificationEntity;
import com.notification.entity.dto.DoctorDTO;
import com.notification.entity.dto.PatientDTO;
import com.notification.feign.DoctorClient;
import com.notification.feign.PatientClient;
import com.notification.repo.NotificationRepo;
import com.notification.service.NotificationService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private DoctorClient doctorClient;

    @Autowired
    private PatientClient patientClient;

    @Autowired
    private NotificationRepo notificationRepo;

    @Override
    public String sendAppointmentNotification(Integer appointmentId, Integer doctorId, Integer patientId) {
        DoctorDTO doctor = doctorClient.getDoctorById(doctorId);
        PatientDTO patient = patientClient.getPatientById(patientId);

        if (doctor == null || patient == null) {
            return "Doctor or Patient not found";
        }

        // Email to patient
        try {
            SimpleMailMessage messageToPatient = new SimpleMailMessage();
            messageToPatient.setTo(patient.getEmail());
            messageToPatient.setSubject("Appointment Confirmation");
            messageToPatient.setText("Dear " + patient.getName() + ",\n\nYour appointment with Dr. " + doctor.getName()
                    + " has been successfully booked.\n\nThank you.\n\nBest Regards,\nHospital Management System");

            javaMailSender.send(messageToPatient);

            NotificationEntity patientNotification = NotificationEntity.builder()
                    .appointmentId(appointmentId)
                    .doctorId(doctorId)
                    .patientId(patientId)
                    .recipientEmail(patient.getEmail())
                    .recipientUsername(patient.getName())
                    .subject("Appointment Confirmation")
                    .message("Your appointment with Dr. " + doctor.getName() + " has been booked.")
                    .timestamp(LocalDateTime.now())
                    .isSent(true)
                    .build();

            notificationRepo.save(patientNotification);
        } catch (Exception e) {
            System.err.println("Error sending email to patient: " + e.getMessage());
        }

        // Email to doctor
        SimpleMailMessage messageToDoctor = new SimpleMailMessage();
        messageToDoctor.setTo(doctor.getEmail());
        messageToDoctor.setSubject("New Appointment Scheduled");
        messageToDoctor.setText("Dear Dr. " + doctor.getName() + ",\n\nYou have a new appointment with patient "
                + patient.getName() + ".\n\nThank you.\n\nBest Regards,\nHospital Management System");

        javaMailSender.send(messageToDoctor);

        NotificationEntity doctorNotification = NotificationEntity.builder()
                .appointmentId(appointmentId)
                .doctorId(doctorId)
                .patientId(patientId)
                .recipientEmail(doctor.getEmail())
                .recipientUsername(doctor.getName())
                .subject("New Appointment Scheduled")
                .message("You have a new appointment with patient " + patient.getName())
                .timestamp(LocalDateTime.now())
                .isSent(true)
                .build();

        notificationRepo.save(doctorNotification);

        return "Appointment emails sent to doctor and patient.";
    }

    @Override
    public String sendAppointmentCancellationEmail(String patientEmail, String doctorEmail,
                                                   Integer appointmentId, Integer doctorId, Integer patientId) {
        try {
            // Email to patient
            SimpleMailMessage messageToPatient = new SimpleMailMessage();
            messageToPatient.setTo(patientEmail);
            messageToPatient.setSubject("Appointment Cancelled");
            messageToPatient.setText("Your appointment has been cancelled.");
            javaMailSender.send(messageToPatient);

            NotificationEntity patientCancelNotification = NotificationEntity.builder()
                    .appointmentId(appointmentId)
                    .doctorId(doctorId)
                    .patientId(patientId)
                    .recipientEmail(patientEmail)
                    .recipientUsername(patientEmail) // Replace with actual username if available
                    .subject("Appointment Cancelled")
                    .message("Your appointment has been cancelled.")
                    .timestamp(LocalDateTime.now())
                    .isSent(true)
                    .build();

            notificationRepo.save(patientCancelNotification);

            // Email to doctor
            SimpleMailMessage messageToDoctor = new SimpleMailMessage();
            messageToDoctor.setTo(doctorEmail);
            messageToDoctor.setSubject("Appointment Cancelled");
            messageToDoctor.setText("An appointment has been cancelled.");
            javaMailSender.send(messageToDoctor);

            NotificationEntity doctorCancelNotification = NotificationEntity.builder()
                    .appointmentId(appointmentId)
                    .doctorId(doctorId)
                    .patientId(patientId)
                    .recipientEmail(doctorEmail)
                    .recipientUsername(doctorEmail) // Replace with actual username if available
                    .subject("Appointment Cancelled")
                    .message("An appointment has been cancelled.")
                    .timestamp(LocalDateTime.now())
                    .isSent(true)
                    .build();

            notificationRepo.save(doctorCancelNotification);
            System.out.println("saved canceled in db");

            return "Cancellation emails and notifications saved for doctor and patient.";
        } catch (Exception e) {
            System.err.println("Error sending cancellation emails: " + e.getMessage());
            return "Failed to send cancellation notifications.";
        }
    }

}
