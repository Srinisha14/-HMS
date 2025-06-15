package com.appointment.services;

import com.appointment.entities.Appointment;
import com.appointment.entities.dto.AppointmentDTO;

import java.util.List;

public interface AppointmentServices {
    List<Appointment> getAllAppointments();
    Appointment getAppointmentById(Integer id);
    Appointment createAppointment(Appointment appointment);
    Appointment updateAppointment(Integer id, Appointment newAppointment);
    void deleteAppointment(Integer id);
    List<Appointment> getAppointmentsByPatientId(Integer patientId);
	List<Appointment> getAppointmentsByDoctorId(Integer doctorId);
}
