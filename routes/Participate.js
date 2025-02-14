const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AddEvent = require('../model/AddEventSchema'); // Event schema import
const Participate = require('../model/ParticipateSchema'); // Participant schema import

const router = express.Router();

// Ensure the upload directory exists
const uploadDir = './uploads/participants';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)), // Create unique filename
});

// File type validation
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
    cb(null, true);
  },
});

// Route to add a new participant
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    console.log("he");
    
    // Validate required fields
    const { fullName, contactNo, eventId } = req.body;
    console.log(fullName);
    console.log(contactNo);
    console.log(eventId);
    console.log(req.file);
    
    
    if (!fullName || !contactNo || !req.file || !eventId) {
      return res.status(400).json({
        success: false,
        message: 'All fields (fullName, contactNo, photo, eventId) are required.',
      });
    }

    // Find the event to get the defined regions
    const event = await AddEvent.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Choose a region (logic to select the region can be expanded) 
    const region = event.regions; // For simplicity, choosing the first region
    console.log(region);
    
    // Create a new participant
    const newParticipant = new Participate({
      fullName,
      contactNo,
      photo: `/uploads/participants/${req.file.filename}`, // Save relative file path
      eventId,
      region, // Save the region where the photo is supposed to be
    });
    await newParticipant.save();
    console.log(event);
    
    res.status(201).json({
      success: true,
      message: 'Participant added successfully',
      participant: newParticipant,
      updatedEvent: event,
    });
  } catch (error) {
    console.error('Error adding participant:', error.message);
    console.error('Stack trace:', error.stack);  // Print the stack trace for deeper investigation
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding the participant.',
    });
  }
});

// Route to update participant photo (handle photo updates)
router.put('/:id/photo', upload.single('photo'), async (req, res) => {
  try {
    const participant = await Participate.findById(req.params.id);

    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found.' });
    }

    // Validate photo upload
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Photo is required to update.' });
    }

    // Delete the old photo if it exists
    if (participant.photo) {
      fs.unlink(participant.photo, (err) => {
        if (err) console.error('Error deleting old photo:', err);
      });
    }

    // Update the photo
    participant.photo = `/uploads/participants/${req.file.filename}`;
    await participant.save();

    res.json({
      success: true,
      message: 'Participant photo updated successfully.',
      participant,
    });
  } catch (error) {
    console.error('Error updating participant photo:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the photo.',
    });
  }
});

module.exports = router;
