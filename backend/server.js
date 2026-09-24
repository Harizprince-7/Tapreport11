const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Tell Express to serve the 'uploads' folder publicly so the frontend can display the images
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://localhost:27017/tapreport')
  .then(() => console.log('✅ Connected to local MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Import and use our new routes!
const reportRoutes = require('./routes/reports');
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
  res.send('Tap Report API is running...');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});