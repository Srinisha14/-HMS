import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Doctor from './pages/Doctor';
import Patient from './pages/Patient';
import DoctorSchedule from './pages/DoctorSchedule';
import Login from './pages/Login';
import Appointment from './pages/Appointment';
import Settings from './pages/Settings';
import Notification from './pages/Notification';
import MedicalHistory from './pages/MedicalHistory';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './routes/ProtectedRoute'; // Use ProtectedRoute
import Profile from './pages/Profile'; // Import the Profile component
import Appointment_Doctor from './pages/Appointment_Doctor';
import Appointment_Patient from './pages/Appointment_Patient';
import MedicalHistoryD from './pages/MedicalHistoryD';
const App = () => {
  const location = useLocation();
  const hideLayout = location.pathname === '/' || location.pathname === '/login' || location.pathname==='/unauthorized';
  const hideLayoutRegister = location.pathname === '/register';

  return (
    <>
      {!hideLayout && !hideLayoutRegister && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/doctor"
          element={<ProtectedRoute allowedRoles={['ADMIN','DOCTOR']}><Doctor /></ProtectedRoute>}
        />
        <Route
          path="/appointments"
          element={<ProtectedRoute allowedRoles={['ADMIN','PATIENT', 'DOCTOR']}><Appointment /></ProtectedRoute>}
        />
        <Route
          path="/patients"
          element={<ProtectedRoute allowedRoles={['ADMIN', 'PATIENT']}><Patient /></ProtectedRoute>}
        />
        <Route
          path="/notifications"
          element={<ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}><Notification /></ProtectedRoute>}
        />
        <Route
          path="/medical-history"
          element={<ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}><MedicalHistory /></ProtectedRoute>}
        />
        <Route
          path="/medical-history-patients"
          element={<ProtectedRoute allowedRoles={['ADMIN', 'PATIENT']}><MedicalHistoryD /></ProtectedRoute>}
        />
        <Route
          path="/doctor-schedule"
          element={<ProtectedRoute allowedRoles={['ADMIN','PATIENT','DOCTOR']}><DoctorSchedule /></ProtectedRoute>}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'PATIENT']}><Settings /></ProtectedRoute>}
        />
         <Route
          path="/profile"
          element={<ProtectedRoute allowedRoles={['DOCTOR', 'PATIENT']}><Profile /></ProtectedRoute>} // Add Profile route
        />
         <Route
          path="/appointmentdoctor"
          element={<ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}><Appointment_Doctor /></ProtectedRoute>}
        />
        <Route
          path="/appointmentpatient"
          element={<ProtectedRoute allowedRoles={['ADMIN', 'PATIENT']}><Appointment_Patient /></ProtectedRoute>}
        />
      </Routes>
      
      {!hideLayout && !hideLayoutRegister && <Footer />}
    </>
  );
};

export default App;