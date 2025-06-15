package com.notification.entity.dto;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;
    private Integer appointmentId;
    private Integer doctorId;
    private Integer patientId;
    private String recipientEmail;
    private String subject;
    private String message;
    private LocalDateTime timestamp;
    private boolean isSent;
}
