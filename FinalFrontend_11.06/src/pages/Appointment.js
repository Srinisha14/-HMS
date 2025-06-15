import React, { useState, useEffect } from 'react';
import './css/Appointment.css';
import FloatingMenu from '../components/FloatingMenu';
import instance from '../api/axios';
 
const Appointment = () => {
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    status: '',
    reason: '',
    patientId: '',
    doctorId: '',
    scheduleId: '',
  });
 
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]); // Filtered schedules based on Doctor ID
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showForm, setShowForm] = useState(false); // Toggle visibility of the appointment creation form
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete operation
 
  // Fetch appointments, doctors, and schedules from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsResponse = await instance.get('/appointment');
        setAppointments(appointmentsResponse.data);
 
        const doctorsResponse = await instance.get('/doctor');
        setDoctors(doctorsResponse.data);
 
        const schedulesResponse = await instance.get('/doctor/schedule');
        setSchedules(schedulesResponse.data);
      } catch (err) {
        setError('Failed to fetch data from the server.');
      }
    };
    fetchData();
  }, []);
 
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
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPopupMessage('');
    setIsLoading(true); // Start loading
 
    const today = new Date().toISOString().split('T')[0];
    if (formData.appointmentDate < today) {
      setError('Appointment date must be in the future.');
      setIsLoading(false); // Stop loading
      return;
    }
 
    // Validate appointment time against the selected schedule's time slot
    const selectedSchedule = filteredSchedules.find(
      (schedule) => schedule.scheduleId === parseInt(formData.scheduleId)
    );
 
    if (selectedSchedule) {
      const [startTime, endTime] = selectedSchedule.availableTimeSlots.split(' - ');
      if (formData.appointmentTime < startTime || formData.appointmentTime > endTime) {
        setError('Appointment time must be within the selected schedule\'s time slot.');
        setIsLoading(false); // Stop loading
        return;
      }
    }
 
    try {
      const newAppointment = {
        ...formData,
        status: 'Scheduled', // Set default status to "Pending"
      };
 
      const response = await instance.post('/appointment', newAppointment);
      setAppointments((prev) => [response.data, ...prev]);
      setPopupMessage('Appointment created successfully!');
      setTimeout(() => setPopupMessage(''), 3000); // Clear popup after 3 seconds
      setFormData({
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        patientId: '',
        doctorId: '',
        scheduleId: '',
      });
      setShowForm(false); // Hide the form after successful submission
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message || 'Failed to create appointment.');
      } else if (err.response?.status === 404) {
        setError('Patient ID not found or Doctor is unavailable at the selected time.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
 
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
      updatedAppointments[editingIndex] = response.data;
      setAppointments(updatedAppointments);
      setEditingIndex(null);
      setPopupMessage('Appointment updated successfully!');
      setTimeout(() => setPopupMessage(''), 3000); // Clear popup after 3 seconds
    } catch (err) {
      setError('Failed to update appointment.');
    }
  };
 
  const handleDelete = async (index) => {
    const confirmDelete = window.confirm('Do you want to permanently delete this appointment?');
    if (confirmDelete) {
      setIsDeleting(true); // Show deleting popup
      try {
        const appointmentId = appointments[index].appointmentId;
        await instance.delete(`/appointment/${appointmentId}`);
        const updatedAppointments = appointments.filter((_, i) => i !== index);
        setAppointments(updatedAppointments);
        setPopupMessage('Appointment deleted successfully!');
        setTimeout(() => setPopupMessage(''), 3000); // Clear popup after 3 seconds
      } catch (err) {
        setError('Failed to delete appointment.');
      } finally {
        setIsDeleting(false); // Hide deleting popup
      }
    }
  };
 
  const filteredAppointments = appointments.filter((appt) =>
    appt.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
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
 
      {/* Search Bar */}
      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Reason"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
 

    {/* Toggle Button for Appointment Creation Form */}
    <div className="toggle-form-container">
        <button className="toggle-form-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Appointment Form' : 'Create Appointment'}
        </button>
      </div>
 
      {/* Appointment Creation Form */}
      {showForm && (
        <div className="appointment-form-container">
          <h2>Create Appointment</h2>
          <form onSubmit={handleSubmit}>
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
            <label>Patient ID</label>
            <input
              type="number"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
            />
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
        <h3>Appointment History</h3>
        <div className="appointment-cards">
          {filteredAppointments.map((appt, index) => (
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
                  <label>Patient ID</label>
                  <input
                    type="number"
                    name="patientId"
                    value={editData.patientId}
                    onChange={handleEditChange}
                  />
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
                  <label>Schedule ID</label>
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
          ))}
        </div>
      </div>
 
      
      <FloatingMenu />
    </>
  );
};
 
export default Appointment;
 
 