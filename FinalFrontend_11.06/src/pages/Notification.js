import React, { useEffect, useState } from 'react';
import './css/Notification.css';
import FloatingMenu from '../components/FloatingMenu';
 
const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const username = localStorage.getItem("username");
 
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:8071/notifications/user/${username}`);
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
 
    fetchNotifications();
  }, [username]);
 
  return (
    <>
      <div className="notification-container">
        <div className="notification-content">
          <h2>Notifications</h2>
          {notifications.length === 0 ? (
            <>
              <p>No notifications yet.</p>
              <img
                src="https://cdn.dribbble.com/users/310943/screenshots/2518631/push-notifications-illustration2.gif"
                alt="Notification"
                className="notification-image"
              />
            </>
          ) : (
            <ul className="notification-list">
  {notifications.map((noti, index) => (
    <li key={index} className="notification-item">
      <strong>{noti.subject}</strong>
      {noti.message}
      <br />
      <small>{new Date(noti.timestamp).toLocaleString()}</small>
    </li>
  ))}
</ul>

          )}
        </div>
      </div>
      <FloatingMenu />
    </>
  );
};
 
export default Notification;
 