import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const AdminMap = () => {
  const [reports, setReports] = useState([]);
  // Center the map roughly on India (or your local area) initially
  const defaultCenter = [20.5937, 78.9629]; 

  // Fetch all reports from the backend when the page loads
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  // Function to update a report's status to Resolved
  const markResolved = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/reports/${id}/status`, {
        status: 'Resolved'
      });
      fetchReports(); // Refresh the map to show the updated status
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Municipal Admin Dashboard</h2>
      <p>Total Issues Reported: {reports.length}</p>

      {/* The Map Container needs a defined height to be visible */}
      <div style={{ height: '600px', width: '100%', border: '2px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
        <MapContainer center={defaultCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
          
          {/* This is the base map layer (OpenStreetMap) */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Loop through our reports and plot a pin for each one */}
          {reports.map((report) => (
            <Marker key={report._id} position={[report.location.lat, report.location.lng]}>
              <Popup>
                <div style={{ maxWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>{report.title}</h3>
                  <p style={{ margin: '0 0 5px 0' }}><strong>Type:</strong> {report.issueType}</p>
                  <p style={{ margin: '0 0 10px 0' }}><strong>Status:</strong> {report.status}</p>
                  
                  {/* Display the uploaded image */}
                  <img 
                    src={`http://localhost:5000/${report.imageUrl}`} 
                    alt="Issue" 
                    style={{ width: '100%', borderRadius: '4px', marginBottom: '10px' }} 
                  />
                  
                  {/* Show a resolve button if the issue is still pending */}
                  {report.status !== 'Resolved' && (
                    <button 
                      onClick={() => markResolved(report._id)}
                      style={{ background: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
        </MapContainer>
      </div>
    </div>
  );
};

export default AdminMap;