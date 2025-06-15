package com.patient.exception;

// Exception when a contact number is already registered
public class ContactNumberAlreadyExistsException extends RuntimeException {
    public ContactNumberAlreadyExistsException(String message) {
        super(message);
    }
}
