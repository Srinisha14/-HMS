package com.notification.controller;
 
import com.notification.entity.NotificationEntity;
import com.notification.service.NotificationService;
import com.notification.repo.NotificationRepo;
 
import java.util.List;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
 
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/notifications")
public class NotificationController {
 
    @Autowired
    private NotificationService notificationService;
 
    @Autowired
    private NotificationRepo notificationRepo; // ✅ Add this line
 
    @PostMapping("/appointment/notify")
    public String sendAppointmentNotification(@RequestParam Integer appointmentId,
                                              @RequestParam Integer doctorId,
                                              @RequestParam Integer patientId) {
        return notificationService.sendAppointmentNotification(appointmentId, doctorId, patientId);
    }
 
    @PostMapping("/appointment/cancellation")
    public String sendCancellationEmail(@RequestParam String patientEmail,
                                        @RequestParam String doctorEmail,
                                        @RequestParam(required = false) Integer appointmentId,
                                        @RequestParam(required = false) Integer doctorId,
                                        @RequestParam(required = false) Integer patientId) {
        return notificationService.sendAppointmentCancellationEmail(patientEmail, doctorEmail, appointmentId, doctorId, patientId);
    }

 
    @GetMapping("/user/{username}")
    public ResponseEntity<List<NotificationEntity>> getNotificationsByUsername(@PathVariable String username) {
        List<NotificationEntity> notifications = notificationRepo.findByRecipientUsername(username);
        return ResponseEntity.ok(notifications);
    }
}
 