package com.patient.exception;

import org.springframework.http.HttpStatus;

public class CustomNotFoundException extends RuntimeException {
    private final HttpStatus status;

    public CustomNotFoundException(String message) {
        super(message);
        this.status = HttpStatus.NOT_FOUND;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
