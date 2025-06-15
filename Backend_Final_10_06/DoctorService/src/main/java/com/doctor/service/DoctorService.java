package com.doctor.service;

import com.doctor.entity.DoctorEntity;

import java.util.List;

public interface DoctorService {
    List<DoctorEntity> getAllDoctors();
    DoctorEntity getDoctorById(Integer id);
    DoctorEntity createDoctor(DoctorEntity doctor);
    DoctorEntity updateDoctor(Integer id, DoctorEntity doctor);
    DoctorEntity getDoctorByName(String name);
    DoctorEntity deleteDoctorById(Integer id);
    DoctorEntity deleteDoctorByName(String name);
    
    List<DoctorEntity> getDoctorBySpecialization(String specialization);
    
    void deleteDoctor(Integer id);
	DoctorEntity getDoctorByEmail(String email);
	
    
   
 
    
}