//package com.medicalhistoryservice.client;
//
//import org.springframework.cloud.openfeign.FeignClient;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//
//@FeignClient(name = "notification-service", url = "http://localhost:8070") // Adjust URL
//public interface NotificationClient {
//    @PostMapping("/notify")
//    void sendNotification(@RequestBody NotificationRequest request);
//}