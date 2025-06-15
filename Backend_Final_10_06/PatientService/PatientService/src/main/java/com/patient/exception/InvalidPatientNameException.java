package com.patient.exception;

// Exception for invalid or missing Patient Name
public class InvalidPatientNameException extends RuntimeException {
    public InvalidPatientNameException(String message) {
        super(message);
    }
}
