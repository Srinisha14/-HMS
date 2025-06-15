import React, { useState } from 'react';
import './css/FloatingMenu.css';
import { useNavigate } from 'react-router-dom';
import {
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaComments,
  FaPlusCircle,
} from 'react-icons/fa';

const FloatingMenu = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleLogoutClick = () => {
    // Clear localStorage and redirect to login
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div
      className="floating-menu"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="circle-button">
        <FaPlusCircle />
      </div>
      {isHovered && (
        <div className="menu-icons">
          <FaBell title="Notifications" onClick={handleNotificationClick} />
          {/* <FaComments title="Chat" /> */}
          <FaCog title="Settings" onClick={handleSettingsClick} />
          <FaSignOutAlt title="Logout" onClick={handleLogoutClick} />
        </div>
      )}
    </div>
  );
};

export default FloatingMenu;