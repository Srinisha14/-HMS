package com.patient.exception;

public class InvalidBloodGroupException extends RuntimeException {
    public InvalidBloodGroupException(String message) {
        super(message);
    }
}
