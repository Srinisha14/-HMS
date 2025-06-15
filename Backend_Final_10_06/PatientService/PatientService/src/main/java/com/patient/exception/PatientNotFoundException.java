package com.patient.exception;

// Exception when the requested Patient ID does not exist
public class PatientNotFoundException extends RuntimeException{
    public PatientNotFoundException(String message) {
        super(message);
    }
}
