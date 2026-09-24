import React, { useState } from 'react';
import axios from 'axios';

const ReportForm = () => {
  // State variables to hold the user's input
  const [title, setTitle] = useState('');
  const [issueType, setIssueType] = useState('Broken Tap');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState('');

  // Function to ask the browser/phone for GPS coordinates
  const getLocation = () => {
    setMessage('Fetching location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setMessage('✅ Location captured successfully!');
        },
        (error) => {
          console.error(error);
          setMessage('❌ Failed to get location. Please allow location access in your browser.');
        }
      );
    } else {
      setMessage('Geolocation is not supported by your browser.');
    }
  };

  // Function to send all data to our Express backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    
    if (!image || !location) {
      setMessage('⚠️ Please provide both an image and your GPS location.');
      return;
    }

    setMessage('Submitting report...');
    
    // We must use FormData instead of standard JSON because we are uploading a file
    const formData = new FormData();
    formData.append('title', title);
    formData.append('issueType', issueType);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('lat', location.lat);
    formData.append('lng', location.lng);

    try {
      await axios.post('https://tap-report-backend.onrender.com/api/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('🎉 Report submitted successfully!');
      
      // Clear the form for the next report
      setTitle('');
      setDescription('');
      setImage(null);
      setLocation(null);
    } catch (error) {
      console.error(error);
      setMessage('❌ Error submitting report. Ensure your backend server is running.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Report a Civic Issue</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="text" 
          placeholder="Short Title (e.g., Leaking pipe on Main St)" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />

        <select 
          value={issueType} 
          onChange={(e) => setIssueType(e.target.value)}
          style={{ padding: '10px' }}
        >
          <option value="Broken Tap">Broken Tap</option>
          <option value="Blocked Drainage">Blocked Drainage</option>
          <option value="Water Leakage">Water Leakage</option>
        </select>

        <textarea 
          placeholder="Additional details..." 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          style={{ padding: '10px', minHeight: '80px' }}
        />

        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            1. Upload Photo
          </label>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" // This prompts mobile devices to open the camera directly
            onChange={(e) => setImage(e.target.files[0])} 
          />
        </div>

        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            2. Pin Location
          </label>
          <button type="button" onClick={getLocation} style={{ padding: '10px', cursor: 'pointer' }}>
            📍 Get My Current Location
          </button>
          {location && <p style={{ fontSize: '12px', color: 'gray', marginTop: '5px' }}>Coordinates saved: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>}
        </div>

        <button type="submit" style={{ padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
          Submit Report
        </button>
      </form>

      {message && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
};

export default ReportForm;