package com.doctor.service.Impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.doctor.DoctorExceptions.DoctorNotFoundException;
import com.doctor.DoctorExceptions.DoctorScheduleNotFoundException;
import com.doctor.DoctorExceptions.InvalidScheduleException;
import com.doctor.dto.DoctorScheduleDTO;
import com.doctor.entity.DoctorEntity;
import com.doctor.entity.DoctorSchedule;
import com.doctor.repo.DoctorRepository;
import com.doctor.repo.DoctorScheduleRepository;
import com.doctor.service.DoctorScheduleService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j // Enables logging
public class DoctorScheduleServiceImpl implements DoctorScheduleService {

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public List<DoctorSchedule> getAllSchedules() {
        log.info("Fetching all doctor schedules...");
        List<DoctorSchedule> schedules = doctorScheduleRepository.findAll();
        log.info("Successfully fetched {} schedules.", schedules.size());
        return schedules;
    }

    @Override
    public DoctorSchedule getScheduleById(Integer id) {
        log.info("Fetching schedule with ID: {}", id);
        return doctorScheduleRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Schedule not found with ID: {}", id);
                    return new DoctorScheduleNotFoundException("Schedule not found with ID: " + id);
                });
    }

    @Override
    public DoctorSchedule createSchedule(DoctorSchedule schedule) {
        log.info("Creating schedule for doctor ID: {}", schedule.getDoctor().getDoctorId());

        if (schedule.getDoctor() == null || schedule.getDoctor().getDoctorId() == null) {
            log.warn("Doctor information is missing or incomplete.");
            throw new DoctorNotFoundException("Doctor information is missing or incomplete.");
        }

        validateDoctor(schedule.getDoctor().getDoctorId());
        validateTimeSlot(schedule.getAvailableTimeSlots());
        validateScheduleDate(schedule.getDate());

        boolean exists = doctorScheduleRepository.findByDoctorAndDateAndAvailableTimeSlots(
                schedule.getDoctor(), schedule.getDate(), schedule.getAvailableTimeSlots()).isPresent();

        if (exists) {
            log.warn("Duplicate schedule detected for doctor ID: {} on date {}", schedule.getDoctor().getDoctorId(), schedule.getDate());
            throw new InvalidScheduleException("A schedule already exists for this doctor at the given date and time.");
        }

        DoctorSchedule savedSchedule = doctorScheduleRepository.save(schedule);
        log.info("Schedule successfully created with ID: {}", savedSchedule.getScheduleId());
        return savedSchedule;
    }

    @Override
    public DoctorSchedule updateSchedule(Integer id, DoctorSchedule schedule) {
        log.info("Updating schedule with ID: {}", id);
        DoctorSchedule existingSchedule = doctorScheduleRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Schedule not found with ID: {}", id);
                    return new DoctorScheduleNotFoundException("Schedule not found with ID: " + id);
                });

        validateDoctor(schedule.getDoctor().getDoctorId());
        validateTimeSlot(schedule.getAvailableTimeSlots());
        validateScheduleDate(schedule.getDate());

        existingSchedule.setAvailableTimeSlots(schedule.getAvailableTimeSlots());
        existingSchedule.setDoctor(schedule.getDoctor());
        existingSchedule.setDate(schedule.getDate());

        DoctorSchedule updatedSchedule = doctorScheduleRepository.save(existingSchedule);
        log.info("Schedule successfully updated with ID: {}", id);
        return updatedSchedule;
    }

    @Override
    public void deleteSchedule(Integer id) {
        log.info("Attempting to delete schedule with ID: {}", id);
        if (!doctorScheduleRepository.existsById(id)) {
            log.error("Schedule deletion failed, ID {} does not exist.", id);
            throw new DoctorScheduleNotFoundException("Schedule not found with ID: " + id);
        }
        doctorScheduleRepository.deleteById(id);
        log.info("Schedule successfully deleted with ID: {}", id);
    }

    @Override
    public List<DoctorScheduleDTO> getAvailableSlotsForDoctor(Integer doctorId, LocalDate date) {
        log.info("Fetching available slots for doctor ID: {} on date: {}", doctorId, date);
        return doctorScheduleRepository.findByDoctorIdAndDate(doctorId, date).stream()
                .filter(DoctorSchedule::isAvailable)
                .map(DoctorScheduleDTO::new)
                .collect(Collectors.toList());
    }

    private void validateDoctor(Integer doctorId) {
        if (doctorId == null || !doctorRepository.existsById(doctorId)) {
            log.warn("Doctor ID {} is invalid or does not exist.", doctorId);
            throw new DoctorNotFoundException("Doctor ID is invalid or does not exist.");
        }
    }

    private void validateScheduleDate(LocalDate date) {
        if (date == null) {
            log.warn("Schedule date validation failed: null date provided.");
            throw new InvalidScheduleException("Schedule date cannot be null.");
        }
        if (date.isBefore(LocalDate.now())) {
            log.warn("Invalid schedule date: {} is in the past.", date);
            throw new InvalidScheduleException("Schedule date cannot be in the past.");
        }
    }

    private void validateTimeSlot(String timeSlot) {
        log.info("Validating time slot: {}", timeSlot);
        String[] parts = timeSlot.split("-");

        if (parts.length != 2) {
            log.warn("Invalid time slot format detected: {}", timeSlot);
            throw new InvalidScheduleException("Time slot format must be 'hh:mm AM/PM - hh:mm AM/PM'");
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);
        try {
            LocalTime start = LocalTime.parse(parts[0].trim(), formatter);
            LocalTime end = LocalTime.parse(parts[1].trim(), formatter);

            if (!start.isBefore(end)) {
                log.warn("Time slot validation failed: {} - {}", start, end);
                throw new InvalidScheduleException("Start time must be before end time.");
            }
        } catch (Exception e) {
            log.error("Invalid time format detected in slot {}: {}", timeSlot, e.getMessage());
            throw new InvalidScheduleException("Invalid time format. Please use 'hh:mm AM/PM' (e.g., 05:00 PM).");
        }
    }
    @Override
    public List<DoctorScheduleDTO> getSchedulesByDoctor(Long doctorId) {
        List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctorDoctorId(doctorId);
        return schedules.stream().map(DoctorScheduleDTO::new).collect(Collectors.toList()); // ✅ Return DTOs
    }
    
    @Override
    public boolean isDoctorAvailable(Integer doctorId, LocalDate date, LocalTime requestedTime) {
        log.info("Checking doctor availability for ID: {} on date {} at time {}", doctorId, date, requestedTime);
        List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctorIdAndDate(doctorId, date);
        boolean isAvailable = schedules.stream().anyMatch(schedule -> isTimeWithinSlot(schedule.getAvailableTimeSlots(), requestedTime));
        log.info("Doctor availability status: {}", isAvailable);
        return isAvailable;
    }

    private boolean isTimeWithinSlot(String timeSlots, LocalTime requestedTime) {
        log.debug("Checking if requested time {} is within slot {}", requestedTime, timeSlots);
        String[] slots = timeSlots.split(",");

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);
        for (String slot : slots) {
            String[] times = slot.trim().split("-");
            if (times.length == 2) {
                try {
                    LocalTime start = LocalTime.parse(times[0].trim(), formatter);
                    LocalTime end = LocalTime.parse(times[1].trim(), formatter);

                    if (!requestedTime.isBefore(start) && requestedTime.isBefore(end)) {
                        log.info("Requested time {} falls within the slot {}", requestedTime, slot);
                        return true;
                    }
                } catch (Exception e) {
                    log.error("Invalid time format in slot {} - {}", slot, e.getMessage());
                }
            }
        }
        return false;
    }
}
