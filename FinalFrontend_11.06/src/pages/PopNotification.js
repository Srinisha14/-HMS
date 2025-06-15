import React from 'react';
import './css/PopNotification.css';

const PopNotification = ({ message, onClose }) => {
  return (
    <div className="pop-notification-container">
      <div className="pop-notification">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PopNotification;

