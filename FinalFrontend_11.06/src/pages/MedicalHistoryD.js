import React, { useState, useEffect } from 'react';
import './css/MedicalHistory.css';
import FloatingMenu from '../components/FloatingMenu';
 
const MedicalHistoryPatient = () => {
  const [histories, setHistories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
 
  const userRole = localStorage.getItem("role"); // ✅ Retrieve logged-in user role
  const patientUsername = localStorage.getItem("username"); // ✅ Retrieve patient username
  const authToken = localStorage.getItem("token"); // ✅ Retrieve auth token correctly, matching Dashboard.js
 
  console.log("Stored Auth Token:", authToken);
 
  useEffect(() => {
    const fetchHistories = async () => {
      try {
        if (!authToken) {
          console.error("Missing auth token. Cannot proceed.");
          setError("Authorization required. Please log in.");
          return;
        }
 
        let response;
 
        if (userRole === "PATIENT") {
          // ✅ Fetch patient profile to get `patientId`
          const patientResponse = await fetch(`http://localhost:8085/patient/profile/${patientUsername}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
 
          if (!patientResponse.ok) {
            throw new Error(`Failed to fetch patient profile: ${patientResponse.status}`);
          }
 
          const patientData = await patientResponse.json();
          console.log("Fetched Patient Data:", patientData);
          const patientIdFetched = patientData.patientId;
 
          if (!patientIdFetched) {
            console.error("Patient ID is missing.");
            setError("Failed to retrieve patient ID.");
            return;
          }
 
          // ✅ Fetch medical history for the logged-in patient
          response = await fetch(`http://localhost:8084/medical-history/patient/${patientIdFetched}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
        } else {
          // ✅ Fetch all medical history for doctors and admins
          response = await fetch(`http://localhost:8084/medical-history`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
        }
 
        if (!response.ok) {
          throw new Error(`Failed to fetch medical histories: ${response.status}`);
        }
 
        const data = await response.json();
        console.log("Fetched Medical History:", data);
        setHistories(data);
      } catch (err) {
        setError("Failed to fetch medical histories.");
        console.error("Error fetching medical histories:", err);
      } finally {
        setIsFetching(false);
      }
    };
 
    if (userRole && patientUsername) fetchHistories();
  }, [userRole, patientUsername, authToken]);
 
  return (
    <>
      <div className="medical-history">
      <div className="history-header">
            <img
              src="https://logodix.com/logo/474136.png" // Make sure this path is correct in your project
              alt="Medical History Logo"
              className="history-logo"
            />
       
             
                </div>
 
        <h3>Medical History Records</h3>
        {isFetching ? (
          <p>Loading medical histories...</p>
        ) : (
          <div className="history-cards">
            {histories.length > 0 ? (
              histories.map((entry, index) => (
                <div className="history-card" key={index}>
                  <div className="card-body">
                    <p><strong>History ID:</strong> {entry.historyId}</p>
                    <p><strong>Date of Visit:</strong> {entry.dateOfVisit}</p>
                    <p><strong>Diagnosis:</strong> {entry.diagnosis}</p>
                    <p><strong>Treatment:</strong> {entry.treatment}</p>
                  </div>
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
 
export default MedicalHistoryPatient;
 
 