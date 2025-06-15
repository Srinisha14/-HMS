package com.notification.entity;
 
import jakarta.persistence.*;

import lombok.*;
 
import java.time.LocalDateTime;
 
@Entity

@Table(name = "notifications")

@Getter

@Setter

@NoArgsConstructor

@AllArgsConstructor

@Builder

public class NotificationEntity {
 
    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
 
    @Column(nullable = true)

    private Integer appointmentId;
 
    @Column(nullable = true)

    private Integer doctorId;
 
    @Column(nullable = true)

    private Integer patientId;
 
    @Column(nullable = false)

    private String recipientEmail;
 
    @Column(nullable = false)

    private String subject;
 
    @Column(nullable = false)

    private String message;
 
    @Column(nullable = false)

    private LocalDateTime timestamp;
 
    @Column(nullable = false)

    private boolean isSent;

    @Column(nullable = false)

    private String recipientUsername;
    
 
}

 