import React, { useState, useEffect } from 'react';
import './css/Settings.css';
import FloatingMenu from '../components/FloatingMenu';
 
const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [muteNotifications, setMuteNotifications] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
 
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);
 
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Settings saved!');
  };
 
  const openModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setShowModal(true);
  };
 
  const closeModal = () => {
    setShowModal(false);
    setModalTitle('');
    setModalContent('');
  };
 
  return (
    <>
      <div className="patient-form-container">
        <h1>Settings</h1>
        <form onSubmit={handleSubmit}>
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              id="darkMode"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <label htmlFor="darkMode">Enable Dark Mode</label>
          </div>
 
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              id="muteNotifications"
              checked={muteNotifications}
              onChange={() => setMuteNotifications(!muteNotifications)}
            />
            <label htmlFor="muteNotifications">Mute Notifications</label>
          </div>
 
 
{/* New button group for side-by-side layout */}
<div className="button-group">
  <button
    type="button"
    className="info-button"
    onClick={() =>
      openModal(
        'About Our Hospital',
        `Welcome to MediCare Hospital, a leading healthcare institution dedicated to providing comprehensive and compassionate medical care.
        Established in 1995, we have been serving the community with a commitment to excellence, innovation, and patient-centric services.
        Our hospital boasts state-of-the-art facilities, advanced medical technology, and a team of highly skilled and experienced healthcare professionals,
        including renowned doctors, surgeons, nurses, and support staff. We offer a wide range of specialties, including cardiology, oncology,
        pediatrics, orthopedics, neurology, and more, ensuring that all your healthcare needs are met under one roof.        Thank you for choosing MediCare Hospital for your healthcare journey. Your well-being is our priority.`
      )
    }
  >
    About Our Hospital
  </button>
 
  <button
    type="button"
    className="info-button"
    onClick={() =>
      openModal(
        'How to Book an Appointment',
        `Booking an appointment at MediCare Hospital is simple and convenient.
        You can follow these steps:\n\n
        1. **Online Booking:** Visit our official website and navigate to the 'Appointments' or 'Book Online' section.
        Select your preferred doctor, specialty, date, and time slot. 
        You will receive a confirmation email or SMS.\n\n
        2. **Phone Booking:** Call our reception desk at [Hospital Phone Number, e.g., +91-XXXXXXXXXX] during working hours.
        Our friendly staff will assist you in scheduling an appointment based on your availability and doctor's schedule.\n\n
        3. **Walk-in Appointments:** While we recommend booking in advance, you can also walk into our hospital during operational hours.
       `
      )
    }
  >
    How to Book an Appointment
  </button>
</div> {/* End of button-group */}
        </form>
      </div>
 
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <h3>{modalTitle}</h3>
            {modalContent.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
 
      <FloatingMenu />
    </>
  );
};
 
export default Settings;
 