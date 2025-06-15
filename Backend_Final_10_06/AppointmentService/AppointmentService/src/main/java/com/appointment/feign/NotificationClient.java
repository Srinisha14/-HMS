package com.appointment.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "NOTIFICATION-SERVICE")
public interface NotificationClient {

    @PostMapping("/notifications/appointment/notify")
    String sendAppointmentNotification(@RequestParam("appointmentId") Integer appointmentId,
                                       @RequestParam("doctorId") Integer doctorId,
                                       @RequestParam("patientId") Integer patientId);

    @PostMapping("/notifications/appointment/cancellation")
    String sendCancellationEmail(@RequestParam("patientEmail") String patientEmail,
                                 @RequestParam("doctorEmail") String doctorEmail);
}
