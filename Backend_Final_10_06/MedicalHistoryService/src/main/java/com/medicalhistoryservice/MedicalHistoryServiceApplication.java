package com.medicalhistoryservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableFeignClients
@EnableDiscoveryClient
@ComponentScan(basePackages = "com.medicalhistoryservice")
public class MedicalHistoryServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedicalHistoryServiceApplication.class, args);
	}

}
