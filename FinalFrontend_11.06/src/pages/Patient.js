import React, { useState, useEffect } from 'react';
import './css/Patient.css';
import FloatingMenu from '../components/FloatingMenu';
import instance from '../api/axios.js';
 
const Patient = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    customgender: '',
    dateOfBirth: '',
    contactNumber: '',
    email: '',
    bloodGroup: '',
    customBloodGroup: '',
    address: '',
    password: '', // Added password field
  });
 
  const [patients, setPatients] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const [popupMessage, setPopupMessage] = useState(''); // State for popup message
  const [showForm, setShowForm] = useState(false); // Toggle visibility of the patient creation form
 
  // Fetch patients from the backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await instance.get('/patient');
        setPatients(response.data);
      } catch (err) {
        setError('Failed to fetch patients');
      }
    };
    fetchPatients();
  }, []);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };
 
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
 
    // Determine final gender and blood group
    const finalGender = formData.gender === 'other' ? formData.customgender : formData.gender;
    const finalBloodGroup = formData.bloodGroup === 'other' ? formData.customBloodGroup : formData.bloodGroup;
 
 
    if (
      !formData.name.trim() ||
      !finalGender.trim() ||
      !formData.dateOfBirth ||
      !formData.contactNumber.trim() ||
      !formData.email.trim() ||
      !finalBloodGroup.trim() ||
      !formData.address.trim() ||
      !formData.password.trim() // Password field check
    ) {
      setError('Please fill in all fields including password.');
      return;
    }
 
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
 
    if (!phoneRegex.test(formData.contactNumber)) {
      setError('Please enter a valid 10-digit phone number starting with 6-9.');
      return;
    }
 
    try {
      // Step 1: Create patient record
      const patientPayload = {
        name: formData.name,
        gender: finalGender,
        dateOfBirth: formData.dateOfBirth,
        contactNumber: formData.contactNumber,
        email: formData.email,
        bloodGroup: finalBloodGroup,
        address: formData.address,
      };
      const patientResponse = await instance.post('http://localhost:8085/patient', patientPayload);
 
      // Step 2: Register user for authentication
      const userPayload = {
        username: formData.name, // Using email as username for patient
        password: formData.password,
        role: 'PATIENT', // Explicitly set role
      };
      await instance.post('http://localhost:8092/auth/register', userPayload);
 
 
      // Update the patient list with the newly created patient
      setPatients((prev) => [
        {
          ...patientResponse.data,
          appointmentId: [], // Initialize with empty appointments
          medicalHistories: [], // Initialize with empty medical histories
        },
        ...prev,
      ]);
 
      // Reset the form
      setFormData({
        name: '',
        gender: '',
        customgender: '',
        dateOfBirth: '',
        contactNumber: '',
        email: '',
        bloodGroup: '',
        customBloodGroup: '',
        address: '',
        password: '',
      });
      setPopupMessage('Patient and User registered successfully!');
      setTimeout(() => setPopupMessage(''), 3000); // Clear popup after 3 seconds
      setShowForm(false); // Hide the form after successful submission
    } catch (err) {
      // Check for specific error messages from backend
      const errorMessage = err.response?.data?.message || 'Failed to add patient or register user.';
      setError(errorMessage);
    }
  };
 
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData(patients[index]);
  };
 
  const handleSave = async () => {
    setError(''); // Clear previous errors
    // Determine final gender and blood group for edit data
    const finalGender = editData.gender === 'other' ? editData.customgender : editData.gender;
    const finalBloodGroup = editData.bloodGroup === 'other' ? editData.customBloodGroup : editData.bloodGroup;
 
    // Basic validation for edit fields
    if (
      !editData.name.trim() ||
      !finalGender.trim() ||
      !editData.dateOfBirth ||
      !editData.contactNumber.trim() ||
      !editData.email.trim() ||
      !finalBloodGroup.trim() ||
      !editData.address.trim()
    ) {
      setError('Please fill in all fields for editing.');
      return;
    }
 
    const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
 
    if (!emailRegex.test(editData.email)) {
      setError('Please enter a valid email address for editing.');
      return;
    }
 
    if (!phoneRegex.test(editData.contactNumber)) {
      setError('Please enter a valid 10-digit phone number starting with 6-9 for editing.');
      return;
    }
 
 
    try {
      const payload = {
        ...editData,
        gender: finalGender,
        bloodGroup: finalBloodGroup,
      };
      const response = await instance.put(`/patient/${editData.patientId}`, payload);
      const updated = [...patients];
      updated[editingIndex] = {
        ...response.data,
        appointmentId: patients[editingIndex].appointmentId, // Preserve existing appointments
        medicalHistories: patients[editingIndex].medicalHistories, // Preserve existing medical histories
      };
      setPatients(updated);
      setEditingIndex(null);
      setPopupMessage('Patient profile updated successfully!');
      setTimeout(() => setPopupMessage(''), 3000); // Clear popup after 3 seconds
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update patient.';
      setError(errorMessage);
    }
  };
 
  const handleDelete = async (index) => {
    const confirmDelete = window.confirm('Do you want to permanently delete this patient? This will also remove their user account.');
    if (confirmDelete) {
      try {
        const patientToDelete = patients[index];
        const patientId = patientToDelete.patientId;
        const patientUserName = patientToDelete.name; // Assuming email is the username for patients
         
       
        // Step 1: Delete patient record
        await instance.delete(`/patient/${patientId}`);
        // console.log("Deleting patient with ID:"+ patientId+ " and username: " + `${patientUserName}`);
        // Step 2: Delete user from authentication table
        // console.log("pp"+patientUserName);
        await instance.delete(`http://localhost:8092/auth/delete-user/${patientUserName}`);
        // console.log("2Deleting patient with ID:"+ patientId+ " and username: " + `${patientUserName}`);
 
        const updated = [...patients];
        updated.splice(index, 1);
        setPatients(updated);
        setPopupMessage('Patient and User deleted successfully!');
        setTimeout(() => setPopupMessage(''), 3000); // Clear popup after 3 seconds
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete patient or user.';
        setError(errorMessage);
      }
    }
  };
 
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditData({});
    setError(''); // Clear errors on cancel
  };
 
  return (
    <>
      {popupMessage && (
        <div className="popup-message-container"> {/* New container for styling */}
          <div className="popup-message success"> {/* Added success class for styling */}
            <p>{popupMessage}</p>
          </div>
        </div>
      )}
      {error && ( // Display general error messages here
        <div className="popup-message-container">
          <div className="popup-message error"> {/* Added error class for styling */}
            <p>{error}</p>
          </div>
        </div>
      )}
       <div className="toggle-form-container">
        <button className="toggle-form-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Patient Registration Form' : 'Create Patient Profile'}
        </button>
      </div>
     
   {showForm && (
        <div className="patient-form-container">
          <h2>Patient Registration</h2>
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formData.gender === 'other' && (
              <>
                <label>Custom Gender</label>
                <input type="text" name="customgender" value={formData.customgender} onChange={handleChange} required />
              </>
            )}
            <label>Date of Birth</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
            <label>Contact Number</label>
            <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            <label>Blood Group</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="other">Other</option>
            </select>
            {formData.bloodGroup === 'other' && (
              <>
                <label>Custom Blood Group</label>
                <input type="text" name="customBloodGroup" value={formData.customBloodGroup} onChange={handleChange} required />
              </>
            )}
            <label>Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} required />
            <label>Password</label> {/* New password field */}
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            <button type="submit">Add Patient</button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      )}
 
      <div className="profile-history">
        <h3>Patient Profile History</h3>
        <div className="profile-cards">
          {patients.map((patient, index) => (
            <div className="profile-card" key={index}>
              {editingIndex === index ? (
                <div className="card-body">
                  <label>Name</label>
                  <input type="text" name="name" value={editData.name} onChange={handleEditChange} />
                  <label>Gender</label>
                  <select name="gender" value={editData.gender} onChange={handleEditChange}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {editData.gender === 'other' && ( // Conditional render for custom gender in edit
                    <>
                      <label>Custom Gender</label>
                      <input type="text" name="customgender" value={editData.customgender || ''} onChange={handleEditChange} />
                    </>
                  )}
                  <label>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={editData.dateOfBirth} onChange={handleEditChange} />
                  <label>Contact Number</label>
                  <input type="tel" name="contactNumber" value={editData.contactNumber} onChange={handleEditChange} />
                  <label>Email</label>
                  <input type="email" name="email" value={editData.email} onChange={handleEditChange} />
                  <label>Blood Group</label>
                  <select name="bloodGroup" value={editData.bloodGroup} onChange={handleEditChange}>
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="other">Other</option>
                  </select>
                  {editData.bloodGroup === 'other' && ( // Conditional render for custom blood group in edit
                    <>
                      <label>Custom Blood Group</label>
                      <input type="text" name="customBloodGroup" value={editData.customBloodGroup || ''} onChange={handleEditChange} />
                    </>
                  )}
                  <label>Address</label>
                  <textarea name="address" value={editData.address} onChange={handleEditChange} />
                  <div className="card-footer">
                    <button className="edit-button" onClick={handleSave}>Save Changes</button>
                    <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-body">
                    <p><strong>Patient ID:</strong> {patient.patientId}</p>
                    <p><strong>Name:</strong> {patient.name}</p>
                    <p><strong>Gender:</strong> {patient.gender}</p>
                    <p><strong>Date of Birth:</strong> {patient.dateOfBirth || 'N/A'}</p>
                    <p><strong>Contact Number:</strong> {patient.contactNumber}</p>
                    <p><strong>Email:</strong> {patient.email}</p>
                    <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
                    <p><strong>Address:</strong> {patient.address || 'N/A'}</p>
                    <p><strong>Appointments:</strong> {patient.appointmentId?.join(', ') || 'None'}</p>
                    <p><strong>Medical Histories:</strong></p>
                    <ul>
                      {patient.medicalHistories && patient.medicalHistories.length > 0 ? (
                        patient.medicalHistories.map((history, idx) => (
                          <li key={idx}>
                            <p><strong>Diagnosis:</strong> {history.diagnosis || 'N/A'}</p>
                            <p><strong>Treatment:</strong> {history.treatment || 'N/A'}</p>
                            <p><strong>Date of Visit:</strong> {history.dateOfVisit ? new Date(history.dateOfVisit).toLocaleDateString() : 'N/A'}</p>
                          </li>
                        ))
                      ) : (
                        <li>No Medical History</li>
                      )}
                    </ul>
                  </div>
                  <div className="card-footer">
                    <button className="edit-button" onClick={() => handleEdit(index)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
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
 
export default Patient;
 