import React, { useState, useEffect } from 'react';
import './css/DoctorAppointment.css';
import instance from '../api/axios';
 
const DoctorAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [medicalHistories, setMedicalHistories] = useState({});
  const [editData, setEditData] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [viewingIndex, setViewingIndex] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
 
  // Get logged-in doctor's username from local storage
  const doctorUsername = localStorage.getItem("username");
 
  // Fetch appointments using doctor ID
  useEffect(() => {
    const fetchDoctorAndAppointments = async () => {
      try {
        // ✅ Fetch doctor ID using stored username
        const doctorResponse = await instance.get(`/doctor/name/${doctorUsername}`);
        const doctorIdFetched = doctorResponse.data.doctorId; // Ensure correct field mapping
 
        setDoctorId(doctorIdFetched); // ✅ Update doctorId state
 
        // ✅ Now fetch appointments using the obtained doctor ID
        if (doctorIdFetched) {
          const appointmentResponse = await instance.get(`/appointment/doctor/${doctorIdFetched}`);
          console.log("Fetched Appointments:", appointmentResponse.data); // ✅ Log fetched appointments
          setAppointments(appointmentResponse.data);
        }
      } catch (err) {
        setError('Failed to fetch doctor ID or appointments.');
        console.error("Error fetching data:", err);
      }
    };
 
    if (doctorUsername) fetchDoctorAndAppointments(); // ✅ Run only if username exists
  }, [doctorUsername]); // ✅ Trigger effect when username changes
 
  // Fetch medical history by patient ID
  const fetchMedicalHistory = async (patientId, index) => {
    try {
      const response = await instance.get(`http://localhost:8084/medical-history/patient/${patientId}`);
      setMedicalHistories((prev) => ({
        ...prev,
        [patientId]: response.data,
      }));
      setViewingIndex(index);
    } catch (err) {
      setMedicalHistories((prev) => ({
        ...prev,
        [patientId]: [],
      }));
    }
  };
 
  // Handle updating medical history
  const handleEdit = (index, appt) => {
    setEditingIndex(index);
    setViewingIndex(null);
    setEditData({
      patientId: appt.patientId,
      dateOfVisit: appt.appointmentDate,
      diagnosis: '',
      treatment: '',
    });
  };
 
  const handleSave = async () => {
    if (!editData.diagnosis.trim() || !editData.treatment.trim()) {
      setError('Diagnosis and treatment are required.');
      return;
    }
 
    try {
      const response = await instance.post('http://localhost:8084/medical-history', editData);
      setMedicalHistories((prev) => ({
        ...prev,
        [editData.patientId]: [...(prev[editData.patientId] || []), response.data],
      }));
      setEditingIndex(null);
      setError(''); // Clear any previous errors on successful save
    } catch (err) {
      setError('Failed to update medical history.');
    }
  };
 
  // Filter appointments based on search term
  const filteredAppointments = appointments.filter((appt) =>
    appt.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  return (
    <>
       {/* Assuming FloatingMenu is a necessary component */}
      {/* Error Messages */}
      {error && <div className="error-message">{error}</div>}
 
      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="🔍 Search by reason (e.g., fever, ...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>
 
      {/* Appointment List */}
      <div className="appointment-history">
        <h3>Appointment History</h3>
        <div className="appointment-cards">
          {filteredAppointments.map((appt, index) => (
            <div className="appointment-card" key={index}>
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
 
              {/* View Medical History */}
              {viewingIndex === index && medicalHistories[appt.patientId] && (
                <div className="medical-history-container">
                  <h4>Medical History</h4>
 
                  {medicalHistories[appt.patientId].length > 0 ? (
                    medicalHistories[appt.patientId].map((history, idx) => (
                      <div key={idx} className="medical-history-entry">
                        <p><strong>Date:</strong> {history.dateOfVisit}</p>
                        <p><strong>Diagnosis:</strong> {history.diagnosis}</p>
                        <p><strong>Treatment:</strong> {history.treatment}</p>
                      </div>
                    ))
                  ) : (
                    <p>No medical history found.</p>
                  )}
 
                </div>
              )}
 
              {/* Update Medical History */}
              {editingIndex === index ? (
                <div className="update-form">
                  <label>Diagnosis</label>
                  <input
                    type="text"
                    name="diagnosis"
                    value={editData.diagnosis}
                    onChange={(e) => setEditData({ ...editData, diagnosis: e.target.value })}
                  />
                  <label>Treatment</label>
                  <textarea
                    name="treatment"
                    value={editData.treatment}
                    onChange={(e) => setEditData({ ...editData, treatment: e.target.value })}
                  />
                  <button className="save-button" onClick={handleSave}>Save</button>
                  <button className="cancel-button" onClick={() => {
                    setEditingIndex(null);
                    setError(''); // Clear error if cancelling
                  }}>Cancel</button>
                </div>
              ) : (
                <div className="card-footer right-align">
                  <button className="view-button" onClick={() => fetchMedicalHistory(appt.patientId, index)}>
                    View Medical History
                  </button>
                  <button className="edit-button" onClick={() => handleEdit(index, appt)}>
                    Update Medical History
                  </button>
                </div>
 
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
 
export default DoctorAppointment;
 