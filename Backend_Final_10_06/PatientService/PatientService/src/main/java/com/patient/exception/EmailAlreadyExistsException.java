package com.patient.exception;

// Exception when an email ID is already registered
public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
