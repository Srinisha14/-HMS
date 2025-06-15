package com.patient.exception;

// Exception for invalid Patient ID
public class InvalidPatientIdException extends RuntimeException {
    public InvalidPatientIdException(String message) {
        super(message);
    }
}
