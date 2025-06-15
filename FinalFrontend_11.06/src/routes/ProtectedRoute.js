// File: src/routes/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
 
const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role')?.toUpperCase();
 
  if (!token) return <Navigate to="/login" />;
  if (!role || !allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;
 
  return children;
};
 
export default ProtectedRoute;