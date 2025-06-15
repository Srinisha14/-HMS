package com.doctor.repo;

import com.doctor.entity.DoctorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<DoctorEntity,Integer> {
	boolean existsByEmail(String email);
	boolean existsByPhone(String contactNumber);
	Optional<DoctorEntity> findByName(String name);
	Optional<DoctorEntity> findByEmail(String email);
	List<DoctorEntity> findBySpecialization(String specialization);
 
}

