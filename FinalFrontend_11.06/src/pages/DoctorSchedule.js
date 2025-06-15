import React, { useState, useEffect } from 'react';
import './css/DoctorSchedule.css';
import FloatingMenu from '../components/FloatingMenu';
import instance from "../api/axios";

const userRole = localStorage.getItem("role"); // Store logged-in user role
const doctorUsername = localStorage.getItem("username"); // Store logged-in doctor username

const DoctorSchedule = () => {
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    timeSlot: '',
  });

  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  // New state to hold all doctors for ADMIN dropdown
  const [allDoctors, setAllDoctors] = useState([]);

  // Fetch schedules and (for ADMIN) all doctors
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        let schedulesResponse;
        let fetchedDoctorId = '';

        if (userRole === "DOCTOR") {
          // Fetch doctor's ID for the logged-in doctor
          const doctorResponse = await instance.get(`/doctor/name/${doctorUsername}`);
          fetchedDoctorId = doctorResponse.data.doctorId;
          // Set doctorId in form data for the logged-in doctor
          setFormData((prev) => ({ ...prev, doctorId: fetchedDoctorId }));

          // Fetch schedules specific to this doctor
          schedulesResponse = await instance.get(`/doctor/schedule/doctor/${fetchedDoctorId}`);
        } else {
          // For ADMIN or other roles, fetch all schedules
          schedulesResponse = await instance.get("/doctor/schedule");

          // For ADMIN, fetch all doctors for the dropdown
          if (userRole === "ADMIN") {
            const doctorsResponse = await instance.get("/doctor"); // Assuming this endpoint gives all doctors
            setAllDoctors(doctorsResponse.data);
          }
        }

        setSchedules(schedulesResponse.data);
        setFilteredSchedules(schedulesResponse.data);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError('Failed to load data. Please try again.');
      }
    };

    if (userRole && doctorUsername) {
      fetchInitialData();
    }
  }, [userRole, doctorUsername]); // Depend on userRole and doctorUsername

  // Handle search by date
  const handleDateSearch = (e) => {
    const dateValue = e.target.value;
    setSearchDate(dateValue);

    if (!dateValue) {
      setFilteredSchedules(schedules);
    } else {
      setFilteredSchedules(schedules.filter(schedule => schedule.date === dateValue));
    }
  };

  // Handle search by doctor name
  const handleDoctorSearch = (e) => {
    const doctorValue = e.target.value.toLowerCase();
    setSearchDoctor(doctorValue);

    if (!doctorValue) {
      setFilteredSchedules(schedules);
    } else {
      setFilteredSchedules(schedules.filter(schedule => schedule.doctorName.toLowerCase().includes(doctorValue)));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData(schedules[index]);
  };

  const handleSave = async () => {
    try {
      const updatedSchedule = {
        ...editData,
        doctor: {
          doctorId: editData.doctorId,
        },
      };

      await instance.put(`/doctor/schedule/${editData.scheduleId}`, updatedSchedule);
      // Update schedules directly after save, then refilter
      const updatedSchedules = schedules.map(s =>
        s.scheduleId === editData.scheduleId ? editData : s
      );
      setSchedules(updatedSchedules);
      setFilteredSchedules(updatedSchedules); // Also update filtered list
      setEditingIndex(null);
      setPopupMessage('Schedule Updated Successfully!');
      setTimeout(() => setPopupMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update schedule:', err.response?.data || err.message);
      setError('Failed to update schedule');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const newSchedule = {
        doctor: {
          doctorId: formData.doctorId,
        },
        availableTimeSlots: formData.timeSlot,
        date: formData.date,
      };

      console.log('Submitting schedule:', newSchedule);

      await instance.post('/doctor/schedule', newSchedule);

      // Re-fetch all schedules to ensure the list is up-to-date and includes the new schedule
      // This is important because the new schedule might have fields like doctorName, specialization
      // that are generated/populated on the backend.
      let response;
      if (userRole === "DOCTOR") {
        // For doctor, refetch only their schedules
        const doctorResponse = await instance.get(`/doctor/name/${doctorUsername}`);
        const doctorIdFetched = doctorResponse.data.doctorId;
        response = await instance.get(`/doctor/schedule/doctor/${doctorIdFetched}`);
      } else {
        // For admin, refetch all schedules
        response = await instance.get("/doctor/schedule");
      }

      setSchedules(response.data);
      setFilteredSchedules(response.data); // Update filtered list as well

      setPopupMessage('Schedule Created Successfully!');
      setTimeout(() => setPopupMessage(''), 3000);
      setFormData((prev) => ({ // Reset form data, but keep doctorId if doctor
        doctorId: userRole === "DOCTOR" ? prev.doctorId : '',
        date: '',
        timeSlot: '',
      }));
      setShowForm(false);
    } catch (err) {
      console.error('Server error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to create schedule');
    }
  };


  const handleDelete = async (index) => {
    const confirmDelete = window.confirm('Do you want to permanently delete this schedule?');
    if (confirmDelete) {
      try {
        const scheduleId = schedules[index].scheduleId;
        await instance.delete(`/doctor/schedule/${scheduleId}`);
        const updatedSchedules = schedules.filter((_, i) => i !== index);
        setSchedules(updatedSchedules);
        setFilteredSchedules(updatedSchedules); // Update filtered list too
        setPopupMessage('Schedule Deleted Successfully!');
        setTimeout(() => setPopupMessage(''), 3000);
      } catch (err) {
        console.error('Failed to delete schedule:', err.response?.data || err.message);
        setError('Failed to delete schedule');
      }
    }
  };


  return (
    <>
      {popupMessage && <div className="popup-message">{popupMessage}</div>}
      
      {userRole !== "PATIENT" && (
        <div className="toggle-form-container">
          <button className="toggle-form-button" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Hide Schedule Form' : 'Create Doctor Schedule'}
          </button>
        </div>
      )}

      {showForm && userRole !== "PATIENT" && (
        <div className="schedule-form-container">
          <h2>Doctor Schedule</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="doctorId">Doctor ID</label>
            {userRole === "ADMIN" ? (
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                className="doctor-select"
                required
              >
                <option value="">Select a Doctor</option>
                {allDoctors.map((doctor) => (
                  <option key={doctor.doctorId} value={doctor.doctorId}>
                    {doctor.doctorId} - {doctor.name}
                  </option>
                ))}
              </select>
            ) : ( // userRole === "DOCTOR"
              <input
                type="number"
                name="doctorId"
                value={formData.doctorId}
                readOnly // Make it read-only
                required
                className="read-only-input" // Add a class for potential styling
              />
            )}

            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <label htmlFor="timeSlot">Time Slot</label>
            <input
              type="text"
              name="timeSlot"
              placeholder="e.g., 05:00 PM - 06:00 PM"
              value={formData.timeSlot}
              onChange={handleChange}
              required
            />

            <button type="submit">Create Schedule</button>
          </form>

          {error && <p className="error">{error}</p>}
        </div>
      )}
      <div className="schedule-history">
        <h3>Schedule History</h3>

        

        {userRole === "PATIENT" && (
          <div className="search-filters">
            {/* <h4 className="search-title">Search Filters</h4> */}
            
      <div className="search-fields">
      <div className="search-field">

            <label>Search by Date:</label>
            <input
              type="date"
              value={searchDate}
              onChange={handleDateSearch}
              placeholder="Select a Date"
            />
            </div>
           <div className="search-field">

            <label>Search by Doctor Name:</label>
            <input
              type="text"
              value={searchDoctor}
              onChange={handleDoctorSearch}
              placeholder="Enter Doctor Name"
            />
          </div>
          

    </div>
  </div>

        )}

        <div className="schedule-cards">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule, index) => (
              <div className="schedule-card" key={schedule.scheduleId || index}> {/* Use scheduleId as key if available */}
                <div className="card-header">
                  <div className="avatar-icon">👨‍⚕️</div>
                  <div className="doctor-schedule-info">
                    <p className="doctor-schedule-name">{`Dr. ${schedule.doctorName}`}</p>
                    <p className="doctor-schedule-specialization">{schedule.doctorSpecialization}</p>
                  </div>
                </div>

                {editingIndex === index ? (
                  <div className="card-body">
                    <label>Date</label>
                    <input
                      type="date"
                      name="date"
                      value={editData.date}
                      onChange={handleEditChange}
                    />
                    <label>Time Slot</label>
                    <input
                      type="text"
                      name="availableTimeSlots"
                      value={editData.availableTimeSlots}
                      onChange={handleEditChange}
                    />
                    <div className="card-footer">
                      <button className="edit-button" onClick={handleSave}>Save Changes</button>
                      <button className="delete-button" onClick={() => setEditingIndex(null)}>Cancel</button> {/* Pass null to exit edit mode */}
                    </div>
                  </div>
                ) : (
                  <div className="card-body">
                    <p><strong>Schedule ID:</strong> {schedule.scheduleId}</p>
                    <p><strong>Doctor ID:</strong> {schedule.doctorId}</p>
                    <p><strong>Date:</strong> {schedule.date}</p>
                    <p><strong>Time Slot:</strong> {schedule.availableTimeSlots}</p>

                    {(userRole === "DOCTOR" || userRole === "ADMIN") && (
                      <div className="card-footer">
                        <button onClick={() => handleEdit(index)} className="edit-button">Edit</button>
                        <button className="edit-button delete-button" onClick={() => handleDelete(index)}>Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
          <p className="card-placeholder"> No schedules found.</p>
          )}
        </div>
      </div>

     

      <FloatingMenu />
    </>
  );
};

export default DoctorSchedule;