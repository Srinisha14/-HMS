import React, { useState, useEffect } from 'react';
import './css/Doctor.css';
import FloatingMenu from '../components/FloatingMenu';
import instance from '../api/axios.js';
import debounce from 'lodash.debounce'; // Install lodash.debounce for debouncing
 
const Doctor = () => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    password: '', // Added password field
  });
 
  const [allDoctors, setAllDoctors] = useState([]); // Store all doctors
  const [doctors, setDoctors] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchError, setSearchError] = useState({ name: '', specialization: '' }); // Separate errors for search
  const [popupMessage, setPopupMessage] = useState(''); // Popup message for success actions
  const [searchName, setSearchName] = useState('');
  const [searchSpecialization, setSearchSpecialization] = useState('');
  const [showForm, setShowForm] = useState(false); // Toggle visibility of the doctor creation form
 
  // Fetch all doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await instance.get('/doctor');
        setAllDoctors(response.data); // Store all doctors
        setDoctors(response.data); // Initially display all doctors
      } catch (err) {
        setSearchError({ name: '', specialization: 'Failed to fetch doctors' });
      }
    };
    fetchDoctors();
  }, []);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
 
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };
 
  // Submit a new doctor profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearchError({ name: '', specialization: '' });
 
    try {
      // Step 1: Register the doctor in the users table with role DOCTOR
      await instance.post('http://localhost:8092/auth/register', {
        username: formData.name, // Use email as the username
        password: formData.password, // Password for authentication
        role: 'DOCTOR', // Default role is DOCTOR
      });
 
      // Step 2: Add the doctor to the doctors table
      const doctorPayload = {
        name: formData.name,
        specialization: formData.specialization,
        email: formData.email,
        phone: formData.phone,
      };
 
      const response = await instance.post('http://localhost:8085/doctor', doctorPayload);
 
      // Update the doctor list
      setAllDoctors((prev) => [response.data, ...prev]);
      setDoctors((prev) => [response.data, ...prev]);
 
      // Show success message
      setPopupMessage('Doctor Created Successfully!');
      setTimeout(() => setPopupMessage(''), 3000); // Clear popup after 3 seconds
 
      // Reset the form
      setFormData({ name: '', specialization: '', email: '', phone: '', password: '' });
      setShowForm(false); // Hide the form after successful submission
    } catch (err) {
      setSearchError({ name: '', specialization: 'Failed to register doctor' });
    }
  };
 
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData(doctors[index]);
  };
 
  const handleSave = async () => {
    try {
      const response = await instance.put(`/doctor/${editData.doctorId}`, editData);
      const updated = [...allDoctors];
      const doctorIndex = updated.findIndex((doc) => doc.doctorId === editData.doctorId);
      updated[doctorIndex] = response.data;
      setAllDoctors(updated);
      setDoctors(updated);
      setEditingIndex(null);
      setPopupMessage('Doctor Updated Successfully!');
      setTimeout(() => setPopupMessage(''), 3000); // Clear popup after 3 seconds
    } catch (err) {
      setSearchError({ name: '', specialization: 'Failed to update doctor' });
    }
  };
 
  const handleDelete = async (index) => {
    const confirmDelete = window.confirm('Do you want to permanently delete this doctor?');
    if (confirmDelete) {
      try {
        const doctorId = doctors[index].doctorId;
        await instance.delete(`/doctor/${doctorId}`);
 
        // console.log("Deleting patient with ID:"+ patientId+ " and username: " + `${patientUserName}`);
 
        await instance.delete(`http://localhost:8092/auth/delete-user/${doctors[index].name}`);
 
        const updated = allDoctors.filter((doc) => doc.doctorId !== doctorId);
        setAllDoctors(updated);
        setDoctors(updated);
        setPopupMessage('Doctor Deleted Successfully!');
        setTimeout(() => setPopupMessage(''), 3000); // Clear popup after 3 seconds
      } catch (err) {
        setSearchError({ name: '', specialization: 'Failed to delete doctor' });
      }
    }
  };
 
  // Combined search function for partial matches
  const searchDoctors = debounce(() => {
    // If both search inputs are empty, reset to all doctors
    if (!searchName.trim() && !searchSpecialization.trim()) {
      setDoctors(allDoctors);
      setSearchError({ name: '', specialization: '' });
      return;
    }
 
    // Filter doctors based on search criteria
    const filteredDoctors = allDoctors.filter((doc) => {
      const matchesName = searchName ? doc.name.toLowerCase().includes(searchName.toLowerCase()) : true;
      const matchesSpecialization = searchSpecialization
        ? doc.specialization.toLowerCase().includes(searchSpecialization.toLowerCase())
        : true;
      return matchesName && matchesSpecialization;
    });
 
    setDoctors(filteredDoctors);
 
    if (filteredDoctors.length === 0) {
      setSearchError({
        name: searchName ? 'No doctors found for the given name' : '',
        specialization: searchSpecialization ? 'No doctors found for the given specialization' : '',
      });
    } else {
      setSearchError({ name: '', specialization: '' });
    }
  }, 300); // Debounce delay of 300ms
 
  // Handle search input changes
  const handleSearchNameChange = (e) => {
    const name = e.target.value;
    setSearchName(name);
 
    // If both search inputs are empty, reset the doctors list
    if (!name.trim() && !searchSpecialization.trim()) {
      setDoctors(allDoctors);
      setSearchError({ name: '', specialization: '' });
      return;
    }
 
    searchDoctors(); // Trigger combined search
  };
 
  const handleSearchSpecializationChange = (e) => {
    const specialization = e.target.value;
    setSearchSpecialization(specialization);
 
    // If both search inputs are empty, reset the doctors list
    if (!specialization.trim() && !searchName.trim()) {
      setDoctors(allDoctors);
      setSearchError({ name: '', specialization: '' });
      return;
    }
 
    searchDoctors(); // Trigger combined search
  };
 
  return (
    <>
      {/* Popup for Success Messages */}
      {popupMessage && <div className="popup-message">{popupMessage}</div>}
 
      {/* Search Bar Section */}
      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={handleSearchNameChange}
          />
          {searchError.name && <p className="error-msg">{searchError.name}</p>}
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Specialization"
            value={searchSpecialization}
            onChange={handleSearchSpecializationChange}
          />
          {searchError.specialization && <p className="error-msg">{searchError.specialization}</p>}
        </div>
      </div>

      {/* Toggle Button for Doctor Creation Form */}
      <div className="toggle-form-container">
        <button className="toggle-form-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Doctor Creation Form'}
        </button>
      </div>
 
      {/* Doctor Creation Form */}
      {showForm && (
        <div className="doctor-form-container">
          <h2>Doctor Registration</h2>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
 
            <label>Specialization</label>
            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required />
 
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
 
            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
 
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
 
            <button type="submit">Register</button>
          </form>
        </div>
      )}
 
      <div className="profile-history">
        <h3>Doctor Profile History</h3>
        <div className="profile-cards">
          {doctors.map((doc, index) => (
            <div className="profile-card" key={index}>
              {doc.name ? (
                <>
                  <div className="card-header">
                    <div className="avatar-icon">🩺</div>
                    <div className="doctor-info">
                      <p className="doctor-name">{doc.name}</p>
                      <p className="specialization">{doc.specialization}</p>
                    </div>
                  </div>
 
                  {editingIndex === index ? (
                    <div className="card-body">
                      <label>Full Name</label>
                      <input type="text" name="name" value={editData.name} onChange={handleEditChange} />
                      <label>Specialization</label>
                      <input type="text" name="specialization" value={editData.specialization} onChange={handleEditChange} />
                      <label>Email</label>
                      <input type="email" name="email" value={editData.email} onChange={handleEditChange} />
                      <label>Phone</label>
                      <input type="text" name="phone" value={editData.phone} onChange={handleEditChange} />
                      <div className="card-footer">
                        <button className="edit-button" onClick={handleSave}>Save Changes</button>
                        <button className="cancel-button" onClick={() => setEditingIndex(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="card-body">
                        <p><strong>Doctor ID:</strong> {doc.doctorId}</p>
                        <p><strong>Email:</strong> {doc.email}</p>
                        <p><strong>Phone:</strong> {doc.phone}</p>
                      </div>
                      <div className="card-footer">
                        <button className="edit-button" onClick={() => handleEdit(index)}>Edit</button>
                        <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="card-placeholder">No data available</div>
              )}
            </div>
          ))}
        </div>
      </div>
 
      
 
      <FloatingMenu />
    </>
  );
};
 
export default Doctor;
 