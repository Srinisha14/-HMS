package com.doctor.service;



import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.doctor.dto.DoctorScheduleDTO;
import com.doctor.entity.DoctorSchedule;
 
public interface DoctorScheduleService {
    List<DoctorSchedule> getAllSchedules();
    DoctorSchedule getScheduleById(Integer id);
    DoctorSchedule createSchedule(DoctorSchedule schedule);
    DoctorSchedule updateSchedule(Integer id, DoctorSchedule schedule);
    void deleteSchedule(Integer id);
	List<DoctorScheduleDTO> getAvailableSlotsForDoctor(Integer doctorId, LocalDate localDate);
	boolean isDoctorAvailable(Integer doctorId, LocalDate parsedDate, LocalTime parsedTime);
    List<DoctorScheduleDTO> getSchedulesByDoctor(Long doctorId); // ✅ Ensure DTO is returned}
}
