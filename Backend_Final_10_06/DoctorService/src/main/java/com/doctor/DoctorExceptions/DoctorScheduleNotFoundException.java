package com.doctor.DoctorExceptions;

public class DoctorScheduleNotFoundException extends RuntimeException {
    public DoctorScheduleNotFoundException(String message) {
        super(message);
    }
}


