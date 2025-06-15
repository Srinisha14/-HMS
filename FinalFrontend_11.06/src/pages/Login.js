import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const response = await axios.post('http://localhost:8092/auth/login', {
        username,
        password,
      });

      const { token, role } = response.data;

      // ✅ Store token & role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username); // Store username for profile fetching

      console.log('Stored Role:', role);

      // ✅ Redirect based on role
      if (role === 'ADMIN') {
        navigate('/dashboard'); // Admin Dashboard
      } else if (role === 'DOCTOR') {
        navigate('/dashboard'); // Doctor Dashboard
      } else if (role === 'PATIENT') {
        navigate('/dashboard'); // Patient Dashboard
      } else {
        navigate('/dashboard'); // Default fallback
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button type="submit">Login</button>
          <p>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}