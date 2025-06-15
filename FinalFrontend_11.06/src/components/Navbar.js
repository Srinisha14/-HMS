import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css';

const Navbar = () => {
  const [doctorDropdownOpen, setDoctorDropdownOpen] = useState(false);
  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [role, setRole] = useState();

  useEffect(() => {
    const loadUser = async () => {
      setRole(localStorage.getItem('role')); // Get the user's role from localStorage
    };
    loadUser();
  }, []);
  
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img
          src="https://tse3.mm.bing.net/th/id/OIP.0s1A58k7axg4zndCoyHxRQHaHa?rs=1&pid=ImgDetMain"
          alt="logo"
          className="logo-img"
        />
        HMS
      </div>

      {/* Admin Dropdown */}
      {role === 'ADMIN' && (
        <ul className="navbar-links">
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li
            className="dropdown"
            onMouseEnter={() => setPatientDropdownOpen(true)}
            onMouseLeave={() => setPatientDropdownOpen(false)}
          >
            <span className="dropdown-toggle">Patient ▾</span>
            {patientDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/patients">Patient Profile</Link>
                </li>
                <li>
                  <Link to="/appointments">Appointments</Link>
                </li>
                <li>
                  <Link to="/medical-history">Medical History</Link>
                </li>
                <li>
                  
                </li>
              </ul>
            )}
          </li>
         
          <li
            className="dropdown"
            onMouseEnter={() => setDoctorDropdownOpen(true)}
            onMouseLeave={() => setDoctorDropdownOpen(false)}
          >
            <span className="dropdown-toggle">Doctor ▾</span>
            {doctorDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/doctor">Doctor Profile</Link>
                </li>
                <li>
                  <Link to="/doctor-schedule">Doctor Schedule</Link>
                </li>
              </ul>
            )}
          </li>
          
          
        </ul>
      )}

      {/* Patient Navigation */}
{role === 'PATIENT' && (
  <ul className="navbar-links">
    <li>
      <Link to="/dashboard">Dashboard</Link>
    </li>
    <li>
      <Link to="/appointmentpatient">Appointment</Link>
    </li>
    <li>
      <Link to="/medical-history-patients">Medical History</Link>
    </li>
    <li>
      <Link to="/doctor-schedule">Doctor Schedule</Link>
    </li>
    <li>
      <a href="/profile">
      <img 
  src="https://tse1.mm.bing.net/th/id/OIP.bJpr9jpclIkXQT-hkkb1KQHaHa?rs=1&pid=ImgDetMain" 
  alt="Profile Icon" 
  className="profile-icon"
/>

      </a>
    </li>
  </ul>
)}


      {/* Doctor Dropdown */}
      {/* Doctor Navbar */}
{role === 'DOCTOR' && (
  <ul className="navbar-links">
    <li>
      <Link to="/dashboard">Dashboard</Link>
    </li>
    <li>
      <Link to="/appointmentdoctor">Appointments</Link>
    </li>
    <li>
      <Link to="/doctor-schedule">Doctor Schedule</Link>
    </li>
    <li>
      <a href="/profile">
      <img 
  src="https://tse1.mm.bing.net/th/id/OIP.bJpr9jpclIkXQT-hkkb1KQHaHa?rs=1&pid=ImgDetMain" 
  alt="Profile Icon" 
  className="profile-icon"
/>

      </a>
    </li>
  </ul>
)}




    </nav>
  );
};

export default Navbar;

