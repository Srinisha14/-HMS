
package com.doctor.DoctorExceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class DoctorGlobalException {

    @ExceptionHandler(DoctorNotFoundException.class)
    public ResponseEntity<Object> handleDoctorNotFound(DoctorNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgument(IllegalArgumentException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericException(Exception ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,ex.getMessage());
    }

	@ExceptionHandler(DuplicateDoctorException.class)
	public ResponseEntity<Object> handleDuplicateDoctor(DuplicateDoctorException ex) {
		return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
	}

	@ExceptionHandler(InvalidEmailFormatException.class)
	public ResponseEntity<Object> handleInvalidEmail(InvalidEmailFormatException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	@ExceptionHandler(InvalidPhoneNumberException.class)
	public ResponseEntity<Object> handleInvalidPhone(InvalidPhoneNumberException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}
	@ExceptionHandler(DoctorScheduleNotFoundException.class)
	public ResponseEntity<Object> handleScheduleNotFound(DoctorScheduleNotFoundException ex) {
	    return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
	}

	@ExceptionHandler(InvalidScheduleException.class)
	public ResponseEntity<Object> handleInvalidSchedule(InvalidScheduleException ex) {
	    return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}


    private ResponseEntity<Object> buildResponse(HttpStatus status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return new ResponseEntity<>(body, status);
    }
    
}
