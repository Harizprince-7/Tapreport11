const mongoose = require('mongoose');

// This defines the structure of every report submitted by a citizen
const reportSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  issueType: { 
    type: String, 
    required: true,
    enum: ['Broken Tap', 'Blocked Drainage', 'Water Leakage'] 
  },
  description: { 
    type: String 
  },
  imageUrl: { 
    type: String, 
    required: true // We will set up image uploading next
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { 
    type: String, 
    default: 'Pending' // All new reports start as Pending
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Export this blueprint so the rest of our server can use it
module.exports = mongoose.model('Report', reportSchema);