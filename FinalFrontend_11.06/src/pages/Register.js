import React, { useState } from 'react';
import axios from 'axios';
import './css/register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'PATIENT',
    gender: '',
    customGender: '',
    dateOfBirth: '',
    contactNumber: '',
    bloodGroup: '',
    customBloodGroup: '',
    address: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false); // New state for popup visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setShowPopup(false); // Hide popup on new submission attempt

    const {
      username,
      email,
      password,
      gender,
      customGender,
      dateOfBirth,
      contactNumber,
      bloodGroup,
      customBloodGroup,
      address,
    } = formData;

    const finalGender = gender === 'Other' ? customGender : gender;
    const finalBloodGroup = bloodGroup === 'Other' ? customBloodGroup : bloodGroup;
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      // !name.trim() ||
      !finalGender.trim() ||
      !dateOfBirth ||
      !contactNumber.trim() ||
      !finalBloodGroup.trim() ||
      !address.trim()
    ) {
      setError('All fields are required.');
      return;
    }
    
    try {
      // Step 1: Create patient
      const patientPayload = {
        name : username,
        gender: finalGender,
        dateOfBirth,
        contactNumber,
        email,
        bloodGroup: finalBloodGroup,
        address,
      };

      await axios.post('http://localhost:8085/patient', patientPayload);

      // Step 2: Register user only if patient creation succeeds
      const userPayload = {
        username,
        password,
        role: 'PATIENT',
      };

      await axios.post('http://localhost:8092/auth/register', userPayload);

      setMessage('Registration successful!');
      setShowPopup(true); // Show the popup
      setTimeout(() => {
        setShowPopup(false); // Optionally hide popup after some time if you want
        navigate('/login');
      }, 2000); // Increased timeout to allow pop-up to be seen
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Patient Registration</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />

          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />

          {/* <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} /> */}

          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {formData.gender === 'Other' && (
            <input
              type="text"
              name="customGender"
              placeholder="Enter your gender"
              value={formData.customGender}
              onChange={handleChange}
            />
          )}

          <label>Date of Birth</label>
          
<input
  type="date"
  name="dateOfBirth"
  value={formData.dateOfBirth}
  onChange={handleChange}
  max={new Date().toISOString().split('T')[0]} // This sets max date to today
/>

          <label>Contact Number</label>
          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />


          <label>Blood Group</label>
          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="Other">Other</option>
          </select>

          {formData.bloodGroup === 'Other' && (
            <input
              type="text"
              name="customBloodGroup"
              placeholder="Enter your blood group"
              value={formData.customBloodGroup}
              onChange={handleChange}
            />
          )}

          <label>Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange} />

          <button type="submit">Register</button>
        </form>

        {error && <p className="error-msg">{error}</p>}
        {message && <p className="success-msg">{message}</p>}

        <div className="login-container">
          <p className="already-user">
            Already a user?{' '}
            <span onClick={() => navigate('/login')} className="login-link">
              Login Here
            </span>
          </p>
          {/* <button className="login-btn" onClick={() => navigate('/login')}>
            Back to Login
          </button> */}
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p className="popup-message">Registration Successful!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;