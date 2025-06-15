import React, { useState, useEffect } from 'react';
import './css/MedicalHistory.css';
import FloatingMenu from '../components/FloatingMenu';

const MedicalHistory = () => {
  const [formData, setFormData] = useState({
    patientId: '',
    dateOfVisit: '',
    diagnosis: '',
    treatment: '',
  });

  const [histories, setHistories] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [popupMessage, setPopupMessage] = useState(''); // State for popup message
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete operation
  const [isFetching, setIsFetching] = useState(true); // Loading state for fetching data
  const [showForm, setShowForm] = useState(false); // Toggle visibility of the medical history creation form

  // Fetch all medical histories from the backend
  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const response = await fetch('http://localhost:8084/medical-history'); // Ensure this matches the API Gateway route
        const data = await response.json();
        setHistories(data);
      } catch (err) {
        setError('Failed to fetch medical histories.');
      } finally {
        setIsFetching(false); // Stop fetching
      }
    };
    fetchHistories();
  }, []);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true); // Start loading

    const today = new Date().toISOString().split('T')[0];

    if (!formData.diagnosis.trim() || !formData.treatment.trim() || !formData.dateOfVisit || !formData.patientId) {
      setError('All fields are required.');
      setIsLoading(false); // Stop loading
      return;
    }

    if (formData.dateOfVisit > today) {
      setError('Date of visit cannot be in the future.');
      setIsLoading(false); // Stop loading
      return;
    }

    if (!/^\d+$/.test(formData.patientId)) {
      setError('Patient ID must be a valid number.');
      setIsLoading(false); // Stop loading
      return;
    }

    try {
      const response = await fetch('http://localhost:8084/medical-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create medical history.');
      }

      const newHistory = await response.json();
      setHistories((prev) => [newHistory, ...prev]);
      setFormData({
        patientId: '',
        dateOfVisit: '',
        diagnosis: '',
        treatment: '',
      });
      setPopupMessage('Medical History Created!'); // Set popup message
      setTimeout(() => setPopupMessage(''), 3000); // Clear popup after 3 seconds
      setShowForm(false); // Hide the form after successful submission
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData(histories[index]);
  };

  const handleSave = async () => {
    if (!editData.diagnosis.trim() || !editData.treatment.trim() || !editData.dateOfVisit || !editData.patientId) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8084/medical-history/${editData.historyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('Failed to update medical history.');
      }

      const updatedHistory = await response.json();
      const updatedHistories = [...histories];
      updatedHistories[editingIndex] = updatedHistory;
      setHistories(updatedHistories);
      setEditingIndex(null);
      setEditData({});
      setPopupMessage('Medical History Updated!'); // Set popup message
      setTimeout(() => setPopupMessage(''), 3000); // Clear popup after 3 seconds
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm('Do you want to permanently delete this record?');
    if (confirmDelete) {
      setIsDeleting(true); // Start deleting
      try {
        const historyId = histories[index].historyId;
        const response = await fetch(`medical-history/${historyId}`, { method: 'DELETE' });

        if (!response.ok) {
          throw new Error('Failed to delete medical history.');
        }

        const updatedHistories = [...histories];
        updatedHistories.splice(index, 1);
        setHistories(updatedHistories);
        setMessage('Medical history deleted successfully.');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsDeleting(false); // Stop deleting
      }
    }
  };

  return (
    <>
      {popupMessage && (
        <div className="popup-message">
          <p>{popupMessage}</p>
        </div>
      )}
      <div className="toggle-form-container">
        <button className="toggle-form-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Medical History Form' : 'Create Medical History'}
        </button>
      </div>

      {showForm && (
        <div className="medical-form-container">
          <h2>Medical History Entry</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="patientId">Patient ID</label>
            <input type="text" name="patientId" value={formData.patientId} onChange={handleChange} required />

            <label htmlFor="dateOfVisit">Date of Visit</label>
            <input type="date" name="dateOfVisit" value={formData.dateOfVisit} onChange={handleChange} required />

            <label htmlFor="diagnosis">Diagnosis</label>
            <input type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange} required />

            <label htmlFor="treatment">Treatment</label>
            <textarea name="treatment" value={formData.treatment} onChange={handleChange} required />

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
        </div>
      )}

      {isDeleting && (
        <div className="deleting-popup">
          <div className="deleting-popup-content">
            <p>Deleting...</p>
          </div>
        </div>
      )}


      <div className="medical-history">
        
<div className="history-header">
    <img
      src="https://logodix.com/logo/474136.png" // Make sure this path is correct in your project
      alt="Medical History Logo"
      className="history-logo"
    />

        <h3>Medical History Records</h3>
        </div>
        {isFetching ? (
          <p>Loading medical histories...</p>
        ) : (
          <div className="history-cards">
            {histories.length > 0 ? (
              histories.map((entry, index) => (
                <div className="history-card" key={index}>
                  {editingIndex === index ? (
                    <div className="card-body">
                      <label>Patient ID</label>
                      <input type="text" name="patientId" value={editData.patientId} onChange={handleEditChange} />
                      <label>Date of Visit</label>
                      <input type="date" name="dateOfVisit" value={editData.dateOfVisit} onChange={handleEditChange} />
                      <label>Diagnosis</label>
                      <input type="text" name="diagnosis" value={editData.diagnosis} onChange={handleEditChange} />
                      <label>Treatment</label>
                      <textarea name="treatment" value={editData.treatment} onChange={handleEditChange} />

                      <div className="card-footer">
                        <button className="edit-button" onClick={handleSave}>
                          Save Changes
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => setEditingIndex(null)} // Exit edit mode
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="card-body">
                        <p><strong>History ID:</strong> {entry.historyId}</p>
                        <p><strong>Patient ID:</strong> {entry.patientId}</p>
                        <p><strong>Date of Visit:</strong> {entry.dateOfVisit}</p>
                        <p><strong>Diagnosis:</strong> {entry.diagnosis}</p>
                        <p><strong>Treatment:</strong> {entry.treatment}</p>
                      </div>
                      <div className="card-footer">
                        <button className="edit-button" onClick={() => handleEdit(index)}>
                          Edit
                        </button>
                        <button
                          className="edit-button delete-button"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>No medical history records found.</p>
            )}
          </div>
        )}
      </div>

      
      <FloatingMenu />
    </>
  );
};

export default MedicalHistory;