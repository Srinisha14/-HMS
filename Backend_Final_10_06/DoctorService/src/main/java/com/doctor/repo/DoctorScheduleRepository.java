package com.doctor.repo;


import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

//import com.example.demo.entity.DoctorSchedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

//import com.doctor.dto.DoctorDTO;
import com.doctor.entity.DoctorEntity;
import com.doctor.entity.DoctorSchedule;

import feign.Param;
 
@Repository

public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Integer> {

    Optional<DoctorSchedule> findByDoctorAndDateAndAvailableTimeSlots(DoctorEntity doctorEntity, LocalDate date, String availableTimeSlots);

//	List<DoctorSchedule> findByDoctorAndDate(DoctorEntity doctor , LocalDate date);
	
	@Query("SELECT ds FROM DoctorSchedule ds WHERE ds.doctor.doctorId = :doctorId AND ds.date = :date")
	List<DoctorSchedule> findByDoctorIdAndDate(@Param("doctorId") Integer doctorId, @Param("date") LocalDate date);
    
    List<DoctorSchedule> findByDoctorDoctorId(Long doctorId); // ✅ Query schedules by doctor ID
}
 
