const express = require("express");
const multer = require("multer");
const fs = require("fs");
const AddEvent = require("../model/AddEventSchema");

const router = express.Router();

// Configure Multer for file uploads    
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage });

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await AddEvent.find(); // Fetch all events from the database
    res.json({ events }); // Send the events in the response
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
});

// Add a new event
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const regions = JSON.parse(req.body.regions); // Parse regions array from request

    // Validate regions data (check if shapes are either "circle" or "square" and if type is "text" or "photo")
    if (regions.some(region => !["circle", "square"].includes(region.shape) || !["text", "photo"].includes(region.type))) {
      return res.status(400).json({ success: false, message: "Invalid shape or type in regions" });
    }

    const newEvent = new AddEvent({
      title: req.body.title,
      description: req.body.description,
      photo: req.file.path, // Store the relative path of the photo
      regions: regions,
    });

    await newEvent.save();
    res.json({ success: true, message: "Event added successfully" });
  } catch (error) {
    console.error("Error adding event:", error);

    // Handle duplicate key error
    if (error.code === 11000 && error.keyPattern?.title) {
      return res
        .status(400)
        .json({ success: false, message: "An event with this title already exists." });
    }

    res.status(500).json({ success: false, message: "Failed to add event" });
  }
});

// Update an existing event by id
router.put("/:id", upload.single("photo"), async (req, res) => {
  try {
    const eventId = req.params.id;

    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      regions: JSON.parse(req.body.regions), // Parse regions array from request
    };

    // Validate regions data (check if shapes are either "circle" or "square" and if type is "text" or "photo")
    if (updatedData.regions.some(region => !["circle", "square"].includes(region.shape) || !["text", "photo"].includes(region.type))) {
      return res.status(400).json({ success: false, message: "Invalid shape or type in regions" });
    }

    if (req.file) {
      updatedData.photo = req.file.path; // Update the photo if a new one is provided
    }

    const updatedEvent = await AddEvent.findByIdAndUpdate(eventId, updatedData, {
      new: true, // Return the updated event
    });

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, message: "Event updated successfully", updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ success: false, message: "Failed to update event" });
  }
});

// Delete an event by id
router.delete("/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventToDelete = await AddEvent.findById(eventId);

    if (!eventToDelete) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Remove the associated image file from the server if it exists
    if (eventToDelete.photo) {
      fs.unlinkSync(eventToDelete.photo); // Delete the image from the filesystem
    }

    // Delete the event from the database
    await AddEvent.findByIdAndDelete(eventId);

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ success: false, message: "Failed to delete event" });
  }
});

module.exports = router;
