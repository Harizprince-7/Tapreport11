const express = require('express');
const multer = require('multer');
const Report = require('../models/Report'); // Import our database blueprint
const router = express.Router();

// Configure Multer to store uploaded images in the 'uploads' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Add a timestamp to the file name so they are always unique
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// POST ROUTE: Submit a new report (Requires an image)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, issueType, description, lat, lng } = req.body;
    
    // Create a new report using the data sent from the frontend
    const newReport = new Report({
      title,
      issueType,
      description,
      imageUrl: req.file.path, // Save the path where the image is stored
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      }
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// GET ROUTE: Fetch all reports for the Admin Map
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// PUT ROUTE: Update a report's status (e.g., Pending -> Resolved)
router.put('/:id/status', async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;