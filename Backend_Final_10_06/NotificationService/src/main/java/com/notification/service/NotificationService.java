package com.notification.service;

public interface NotificationService {
    String sendAppointmentNotification(Integer appointmentId, Integer doctorId, Integer patientId);
    String sendAppointmentCancellationEmail(String patientEmail, String doctorEmail,
            Integer appointmentId, Integer doctorId, Integer patientId);

}
