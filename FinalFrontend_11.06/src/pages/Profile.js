import React, { useState, useEffect } from 'react';
import axios from '../api/axios'; // Use your axios instance
import './css/Profile.css';
import FloatingMenu from '../components/FloatingMenu';

const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username || !role) {
        console.error('Username or role is missing');
        setError('Failed to load profile data. Username or role is missing.');
        return;
      }

      try {
        let endpoint = '';
        if (role === 'DOCTOR') {
          endpoint = `/doctor/name/${username}`;
        } else if (role === 'PATIENT') {
          endpoint = `/patient/ownprofile/${username}`;
        } else {
          setError('Invalid role. Unable to fetch profile.');
          return;
        }

        const response = await axios.get(endpoint);
        setProfileData(response.data);
        setFormData(response.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile data.');
      }
    };

    fetchProfile();
  }, [username, role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      let endpoint = '';
      if (role === 'DOCTOR') {
        endpoint = `/doctor/name/${username}`;
      } else if (role === 'PATIENT') {
        endpoint = `/patient/profile/${username}`;
      } else {
        setError('Invalid role. Unable to update profile.');
        return;
      }

      const response1 = await axios.get(endpoint);
      let response = '';
      if (role === 'PATIENT') {
        response = await axios.put(`/patient/${response1.data.patientId}`, formData);
      } else if (role === 'DOCTOR') {
        response = await axios.put(`/doctor/${response1.data.doctorId}`, formData);
      }

      setProfileData(response.data);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile.');
    }
  };

  return (
    
    <div className="profile-wrapper">

    <div className="profile-container">
      <div className="profile-avatar">
        <img src="https://www.creativefabrica.com/wp-content/uploads/2020/03/09/Avatar-glyph-blue-icon-vector-Graphics-3471147-1.jpg" alt="User Avatar" />
      </div>

      <h2>User Profile</h2>
      {error && <p className="error-msg">{error}</p>}
      {successMessage && <p className="success-msg">{successMessage}</p>}

      {!isEditing ? (
        <div className="profile-details">
          <p><strong>Username:</strong> {username}</p>
          <p><strong>{role === 'DOCTOR' ? 'Doctor ID' : 'Patient ID'}:</strong> {role === 'DOCTOR' ? profileData.doctorId : profileData.patientId}</p>
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          {role === 'DOCTOR' && (
            <>
              <p><strong>Specialization:</strong> {profileData.specialization}</p>
              <p><strong>Contact Number:</strong> {profileData.phone}</p>
            </>
          )}
          {role === 'PATIENT' && (
            <>
              <p><strong>Gender:</strong> {profileData.gender}</p>
              <p><strong>Blood Group:</strong> {profileData.bloodGroup}</p>
              <p><strong>Date of Birth:</strong> {profileData.dateOfBirth}</p>
              <p><strong>Address:</strong> {profileData.address}</p>
              <p><strong>Contact Number:</strong> {profileData.contactNumber}</p>
            </>
          )}
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <div className="profile-edit-form">
          {/* <label>Name</label>
          <input type="text" name="name" value={formData.name || ''} onChange={handleChange} /> */}
          <label>Email</label>
          <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
          {role === 'DOCTOR' && (
            <>
              <label>Specialization</label>
              <input type="text" name="specialization" value={formData.specialization || ''} onChange={handleChange} />
              <label>Contact Number</label>
              <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} />
            </>
          )}
          {role === 'PATIENT' && (
            <>
              <label>Gender</label>
              <input type="text" name="gender" value={formData.gender || ''} onChange={handleChange} />
              <label>Blood Group</label>
              <input type="text" name="bloodGroup" value={formData.bloodGroup || ''} onChange={handleChange} />
              <label>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} />
              <label>Address</label>
              <input type="text" name="address" value={formData.address || ''} onChange={handleChange} />
              <label>Contact Number</label>
              <input type="text" name="contactNumber" value={formData.contactNumber || ''} onChange={handleChange} />
            </>
          )}
          <button onClick={handleSave}>Save Changes</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
      
      
    </div>
    <FloatingMenu />
    </div>
    
  );
};

export default Profile;
