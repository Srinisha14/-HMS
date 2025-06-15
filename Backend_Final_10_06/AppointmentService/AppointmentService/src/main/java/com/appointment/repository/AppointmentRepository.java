package com.appointment.repository;

import com.appointment.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment,Integer> {

    List<Appointment> findByPatientId(Integer patientId);
    List<Appointment> findByDoctorId(Integer doctorId);

	boolean existsByPatientIdAndAppointmentDate(Integer patientId, LocalDateTime appointmentDateTime);

	boolean existsByDoctorIdAndAppointmentDate(Integer doctorId, LocalDateTime appointmentDateTime);
    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTime(Integer doctorId, LocalDate appointmentDate, LocalTime appointmentTime);
}
