package com.notification.repo;
 
 
import java.util.List;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
 
import com.notification.entity.NotificationEntity;
 
public interface NotificationRepo extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByRecipientEmail(String email);
    List<NotificationEntity> findByRecipientUsername(String username);
 
 
}
 