import React, { useState, useEffect } from 'react';
import './css/Appointment.css';
import FloatingMenu from '../components/FloatingMenu';
import instance from '../api/axios';

const Appointment_Patient = () => {
  // --- Get Logged-in Username from Local Storage ---
  // This will retrieve the username stored in localStorage after a successful login.
  const loggedInUsername = localStorage.getItem("username");

  // State to store the dynamically fetched patient ID
  const [loggedInPatientId, setLoggedInPatientId] = useState(null);
  // States for managing the loading and error when fetching patient ID
  const [isPatientIdLoading, setIsPatientIdLoading] = useState(true);
  const [patientIdError, setPatientIdError] = useState('');

  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    status: '',
    reason: '',
    patientId: '', // This will be pre-filled after loggedInPatientId is fetched
    doctorId: '',
    scheduleId: '',
  });

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({}); // Corrected line
  const [error, setError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // EFFECT 1: Fetch the logged-in patient's ID based on username from localStorage
  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        setIsPatientIdLoading(true);
        setPatientIdError(''); // Clear previous errors

        if (!loggedInUsername) {
          setPatientIdError('No logged-in username found in local storage. Please log in.');
          setIsPatientIdLoading(false); // Stop loading if no username
          return;
        }

        const response = await instance.get(`/patient/profile/${loggedInUsername}`);
        //console.log("patient:");
        // Assuming the response structure is { ..., patientId: X, ... }
        if (response.data && response.data.patientId) {
          setLoggedInPatientId(response.data.patientId);
          // Pre-fill formData with the fetched patient ID for new appointments
          setFormData(prev => ({ ...prev, patientId: response.data.patientId.toString() }));
        } else {
          setPatientIdError('Patient ID not found in profile data for the logged-in user.');
          setLoggedInPatientId(null); // Explicitly set to null if not found
        }
      } catch (err) {
   
        console.error('Error fetching patient profile:', err);
        setPatientIdError('Failed to fetch patient profile. Please ensure your username is correct and your profile exists.');
        setLoggedInPatientId(null); // Set to null on error
      } finally {
        setIsPatientIdLoading(false);
      }
    };

    fetchPatientProfile();
  }, [loggedInUsername]); // Dependency: re-run if username changes (though it typically won't change after initial load)

  // EFFECT 2: Fetch appointments, doctors, and schedules AFTER patient ID is loaded
  useEffect(() => {
    const fetchData = async () => {
      // Only proceed if patient ID is successfully loaded and not null
      if (loggedInPatientId !== null) {
        try {
          // Fetch all appointments and then filter by loggedInPatientId on the frontend.
          // For large datasets, a backend endpoint like `/appointment/patient/${loggedInPatientId}` would be more efficient.
          const appointmentsResponse = await instance.get('/appointment');
          const patientAppointments = appointmentsResponse.data.filter(
            (appt) => appt.patientId === loggedInPatientId
          );
          setAppointments(patientAppointments);

          const doctorsResponse = await instance.get('/doctor');
          setDoctors(doctorsResponse.data);

          const schedulesResponse = await instance.get('/doctor/schedule');
          setSchedules(schedulesResponse.data);
        } catch (err) {
          setError('Failed to fetch data from the server.');
          console.error('Error fetching data:', err);
        }
      }
    };
    fetchData();
  }, [loggedInPatientId]); // Dependency: This effect runs when loggedInPatientId changes (from null to a value)

  // Filter schedules based on selected Doctor ID
  useEffect(() => {
    if (formData.doctorId) {
      const filtered = schedules.filter(
        (schedule) => schedule.doctorId === parseInt(formData.doctorId)
      );
      setFilteredSchedules(filtered);
    } else {
      setFilteredSchedules([]);
    }
  }, [formData.doctorId, schedules]);

  // Filter schedules based on selected Doctor ID during editing
  useEffect(() => {
    if (editingIndex !== null && editData.doctorId) {
      const filtered = schedules.filter(
        (schedule) => schedule.doctorId === parseInt(editData.doctorId)
      );
      setFilteredSchedules(filtered);
    }
  }, [editData.doctorId, schedules, editingIndex]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper function to convert 12-hour time (e.g., "09:00 AM") to 24-hour format (e.g., "09:00")

  // This function should be defined outside the handleSubmit, for example,

  // at the top of your component file or as a utility function.

  const convertTo24Hour = (time12h) => {

    const [time, period] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    hours = parseInt(hours, 10);

    if (period === 'PM' && hours < 12) {

      hours += 12;

    } else if (period === 'AM' && hours === 12) {

      hours = 0; // 12:xx AM is 00:xx in 24-hour format

    }

    // Ensure hours are always two digits (e.g., 9 becomes 09)

    return `${String(hours).padStart(2, '0')}:${minutes}`;

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');

    setPopupMessage('');

    setIsLoading(true);

    // Ensure patient ID is available before submitting

    if (loggedInPatientId === null) {

      setError('Patient ID not loaded. Please wait or refresh the page.');

      setIsLoading(false);

      return;

    }

    // Date validation: Appointment date must be in the future

    const today = new Date().toISOString().split('T')[0]; // Gets today's date in 'YYYY-MM-DD' format

    if (formData.appointmentDate < today) {

      setError('Appointment date must be in the future or today.'); // Changed "future" to "future or today"

      setIsLoading(false);

      return;

    }

    // Find the selected schedule based on formData.scheduleId

    const selectedSchedule = filteredSchedules.find(

      (schedule) => schedule.scheduleId === parseInt(formData.scheduleId, 10) // Use parseInt with radix

    );

    // Time validation: Appointment time must be within the selected schedule's slot

    if (selectedSchedule) {

      const [scheduleStartTime12h, scheduleEndTime12h] = selectedSchedule.availableTimeSlots.split(' - ');

      // Convert both schedule times to 24-hour format for reliable comparison

      const scheduleStartTime24h = convertTo24Hour(scheduleStartTime12h);

      const scheduleEndTime24h = convertTo24Hour(scheduleEndTime12h);

      // Assuming formData.appointmentTime is already in "HH:mm" (24-hour) format

      const appointmentTime24h = formData.appointmentTime;

      // Check if the appointment time is outside the available slot

      if (appointmentTime24h < scheduleStartTime24h || appointmentTime24h > scheduleEndTime24h) {

        setError('Appointment time must be within the selected schedule\'s time slot.');

        setIsLoading(false);

        return;

      }

    } else {

      // If no schedule is selected or found, provide an error

      setError('Please select a valid doctor schedule.');

      setIsLoading(false);

      return;

    }

    try {

      const newAppointment = {

        ...formData,

        patientId: loggedInPatientId, // Use the fetched loggedInPatientId here

        status: 'Scheduled',

      };

      const response = await instance.post('/appointment', newAppointment);

      // Only add to the list if the created appointment belongs to the current patient

      if (response.data.patientId === loggedInPatientId) {

        setAppointments((prev) => [response.data, ...prev]);

      }

      setPopupMessage('Appointment created successfully!');

      setTimeout(() => setPopupMessage(''), 3000); // Clear popup message after 3 seconds

      // Reset form data after successful submission

      setFormData({

        appointmentDate: '',

        appointmentTime: '',

        reason: '',

        patientId: loggedInPatientId.toString(), // Reset patientId to the fetched one

        doctorId: '',

        scheduleId: '',

      });

      setShowForm(false); // Hide the form after submission

    } catch (err) {

      // Enhanced error handling

      if (err.response) {

        // The request was made and the server responded with a status code

        // that falls out of the range of 2xx

        if (err.response.status === 400) {

          setError(err.response.data.message || 'Failed to create appointment: Invalid data provided.');

        } else if (err.response.status === 404) {

          setError('Patient ID not found or Doctor is unavailable at the selected time.');

        } else if (err.response.status === 409) { // Example for a common conflict error

          setError(err.response.data.message || 'Appointment slot is already taken. Please choose another time.');

        } else {

          setError(`Server error (${err.response.status}): ${err.response.data.message || 'An unexpected server error occurred.'}`);

        }

      } else if (err.request) {

        // The request was made but no response was received

        setError('No response from server. Please check your internet connection.');

      } else {

        // Something happened in setting up the request that triggered an Error

        setError('An unexpected error occurred. Please try again.');

      }

      console.error('Error submitting appointment:', err);

    } finally {

      setIsLoading(false); // Always stop loading, regardless of success or failure

    }

  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setPopupMessage('');
  //   setIsLoading(true);

  //   // Ensure patient ID is available before submitting
  //   if (loggedInPatientId === null) {
  //     setError('Patient ID not loaded. Please wait or refresh the page.');
  //     setIsLoading(false);
  //     return;
  //   }

  //   const today = new Date().toISOString().split('T')[0];
  //   if (formData.appointmentDate < today) {
  //     setError('Appointment date must be in the future.');
  //     setIsLoading(false);
  //     return;
  //   }

  //   const selectedSchedule = filteredSchedules.find(
  //     (schedule) => schedule.scheduleId === parseInt(formData.scheduleId)
  //   );

  //   if (selectedSchedule) {
  //     const [startTime, endTime] = selectedSchedule.availableTimeSlots.split(' - ');
  //     if (formData.appointmentTime < startTime || formData.appointmentTime > endTime) {
  //       setError('Appointment time must be within the selected schedule\'s time slot.');
  //       setIsLoading(false);
  //       return;
  //     }
  //   }

  //   try {
  //     const newAppointment = {
  //       ...formData,
  //       patientId: loggedInPatientId, // Use the fetched loggedInPatientId here
  //       status: 'Pending',
  //     };

  //     const response = await instance.post('/appointment', newAppointment);
  //     // Only add to the list if the created appointment belongs to the current patient
  //     if (response.data.patientId === loggedInPatientId) {
  //       setAppointments((prev) => [response.data, ...prev]);
  //     }
  //     setPopupMessage('Appointment created successfully!');
  //     setTimeout(() => setPopupMessage(''), 3000);
  //     setFormData({
  //       appointmentDate: '',
  //       appointmentTime: '',
  //       reason: '',
  //       patientId: loggedInPatientId.toString(), // Reset patientId to the fetched one
  //       doctorId: '',
  //       scheduleId: '',
  //     });
  //     setShowForm(false);
  //   } catch (err) {
  //     if (err.response?.status === 400) {
  //       setError(err.response.data.message || 'Failed to create appointment.');
  //     } else if (err.response?.status === 404) {
  //       setError('Patient ID not found or Doctor is unavailable at the selected time.');
  //     } else {
  //       setError('An unexpected error occurred. Please try again.');
  //     }
  //     console.error('Error submitting appointment:', err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData(appointments[index]);
  };

  const handleSave = async () => {
    if (!editData.doctorId) {
      setError('Please select a doctor.');
      return;
    }
    if (!editData.scheduleId) {
      setError('Please select a schedule.');
      return;
    }

    try {
      const response = await instance.put(`/appointment/${editData.appointmentId}`, editData);
      const updatedAppointments = [...appointments];
      // Verify that the edited appointment still belongs to the logged-in patient
      if (response.data.patientId === loggedInPatientId) {
        updatedAppointments[editingIndex] = response.data;
        setAppointments(updatedAppointments);
        setEditingIndex(null);
        setPopupMessage('Appointment updated successfully!');
        setTimeout(() => setPopupMessage(''), 3000);
      } else {
        // If patient ID was somehow changed (which it shouldn't be possible from this UI),
        // remove it from the list of current patient's appointments.
        setAppointments(appointments.filter(appt => appt.appointmentId !== response.data.appointmentId));
        setEditingIndex(null);
        setPopupMessage('Appointment updated, but now belongs to a different patient ID and is removed from your view.');
        setTimeout(() => setPopupMessage(''), 5000);
      }
    } catch (err) {
      setError('Failed to update appointment.');
      console.error('Error updating appointment:', err);
    }
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm('Do you want to permanently delete this appointment?');
    if (confirmDelete) {
      setIsDeleting(true);
      try {
        const appointmentId = appointments[index].appointmentId;
        await instance.delete(`/appointment/${appointmentId}`);
        const updatedAppointments = appointments.filter((_, i) => i !== index);
        setAppointments(updatedAppointments);
        setPopupMessage('Appointment deleted successfully!');
        setTimeout(() => setPopupMessage(''), 3000);
      } catch (err) {
        setError('Failed to delete appointment.');
        console.error('Error deleting appointment:', err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // --- Conditional Rendering based on Patient ID Loading ---
  if (isPatientIdLoading) {
    return (
      <div className="loading-container">
        <p>Loading your patient profile...</p>
        {/* You can add a spinner or more elaborate loading UI here */}
      </div>
    );
  }

  if (patientIdError) {
    return (
      <div className="error-container">
        <p>Error: {patientIdError}</p>
        <p>Please ensure you are logged in and your patient profile exists.</p>
        {/* Potentially a "Retry" button or login link */}
      </div>
    );
  }

  if (loggedInPatientId === null) {
    // This case should ideally be caught by patientIdError if a profile was not found.
    // But it's a final safeguard if loggedInPatientId remains null for some reason.
    return (
      <div className="error-container">
        <p>Your patient ID could not be retrieved. Please contact support if the issue persists.</p>
      </div>
    );
  }

  // --- Main Component Rendering (only if patient ID is successfully loaded) ---
  return (
    <>
      {/* Popup for Success or Error Messages */}
      {popupMessage && <div className="popup-message">{popupMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Deleting Popup */}
      {isDeleting && (
        <div className="deleting-popup">
          <div className="deleting-popup-content">
            <p>Deleting...</p>
          </div>
        </div>
      )}

      {/* Static Patient ID Display */}
      {/* <div className="static-patient-id-container">
        <p>
          <strong>Patient ID:</strong> {loggedInPatientId}
        </p>
      </div> */}

<div className="toggle-form-container">
        <button className="toggle-form-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Appointment Form' : 'Create New Appointment'}
        </button>
      </div>

      {/* Appointment Creation Form */}
      {showForm && (
        <div className="appointment-form-container">
          <h2>Create Appointment</h2>
          <form onSubmit={handleSubmit}>
            <label>Patient ID:</label>
            <input
              type="number"
              name="patientId"
              value={loggedInPatientId}
              readOnly // Make it read-only
              required
              className="read-only-input" // Add a class for potential styling
            />
            <label>Appointment Date</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
            />
            <label>Appointment Time</label>
            <input
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
            />
            <label>Reason</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            />
            {/* Patient ID is pre-filled and not editable for the patient */}
            {/* <p><strong>Patient ID:</strong> {loggedInPatientId}</p> */}

            <label>Doctor Name</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc.doctorId} value={doc.doctorId}>
                  {doc.name}
                </option>
              ))}
            </select>
            <label>Schedule Date</label>
            <select
              name="scheduleId"
              value={formData.scheduleId}
              onChange={handleChange}
              required
            >
              <option value="">Select Schedule</option>
              {filteredSchedules.map((schedule) => (
                <option key={schedule.scheduleId} value={schedule.scheduleId}>
                  {schedule.date} - {schedule.availableTimeSlots}
                </option>
              ))}
            </select>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Booking...' : 'Create Appointment'}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      )}

      {/* Appointment List Section */}
      <div className="appointment-history">
        <h3>Your Appointment History</h3>
        <div className="appointment-cards">
          {appointments.length > 0 ? ( // Use `appointments` directly as it's already filtered
            appointments.map((appt, index) => (
              <div className="appointment-card" key={index}>
                {editingIndex === index ? (
                  <div className="card-body">
                    {/* Edit Form */}
                    <label>Appointment Date</label>
                    <input
                      type="date"
                      name="appointmentDate"
                      value={editData.appointmentDate}
                      onChange={handleEditChange}
                    />
                    <label>Appointment Time</label>
                    <input
                      type="time"
                      name="appointmentTime"
                      value={editData.appointmentTime}
                      onChange={handleEditChange}
                    />
                    <label>Status</label>
                    <select name="status" value={editData.status} onChange={handleEditChange}>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <label>Reason</label>
                    <input
                      type="text"
                      name="reason"
                      value={editData.reason}
                      onChange={handleEditChange}
                    />
                    {/* Patient ID is now static text, not editable for the patient */}
                    <p><strong>Patient ID:</strong> {editData.patientId}</p>


                    <label>Doctor Name</label>
                    <select
                      name="doctorId"
                      value={editData.doctorId}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map((doc) => (
                        <option key={doc.doctorId} value={doc.doctorId}>
                          {doc.name}
                        </option>
                      ))}
                    </select>
                    <label>Schedule Date</label>
                    <select
                      name="scheduleId"
                      value={editData.scheduleId}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Schedule</option>
                      {filteredSchedules.length > 0 ? (
                        filteredSchedules.map((schedule) => (
                          <option key={schedule.scheduleId} value={schedule.scheduleId}>
                            {schedule.date} - {schedule.availableTimeSlots}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No schedules available</option>
                      )}
                    </select>
                    <div className="card-footer">
                      <button className="edit-button" onClick={handleSave}>
                        Save Changes
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => setEditingIndex(null)} // Exit edit mode
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Appointment Details */}
                    <div className="card-body">
                      <p><strong>Appointment ID:</strong> {appt.appointmentId}</p>
                      <p><strong>Date:</strong> {appt.appointmentDate}</p>
                      <p><strong>Time:</strong> {appt.appointmentTime}</p>
                      <p><strong>Status:</strong> {appt.status}</p>
                      <p><strong>Reason:</strong> {appt.reason}</p>
                      <p><strong>Patient ID:</strong> {appt.patientId}</p>
                      <p><strong>Doctor ID:</strong> {appt.doctorId}</p>
                      <p><strong>Schedule ID:</strong> {appt.scheduleId}</p>
                    </div>
                    <div className="card-footer">
                      <button className="edit-button" onClick={() => handleEdit(index)}>
                        Edit
                      </button>
                      <button
                        className="edit-button delete-button"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No appointments found for Patient ID: {loggedInPatientId}.</p>
          )}
        </div>
      </div>

      {/* Toggle Button for Appointment Creation Form */}
      

      <FloatingMenu />
    </>
  );
};

export default Appointment_Patient;