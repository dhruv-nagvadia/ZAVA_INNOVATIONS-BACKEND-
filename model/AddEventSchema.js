const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
  shape: {
    type: String,
    enum: ["circle", "square"], // The shape of the region (circle or square)
    required: true,
  },
  x: {
    type: Number,
    required: true, // X coordinate for the region
  },
  y: {
    type: Number,
    required: true, // Y coordinate for the region
  },
  width: {
    type: Number,
    required: true, // Width for square or radius for circle
  },
  height: {
    type: Number,
    required: true, // Height for square (radius for circle)
  },
  color: {
    type: String,
    default: "#FF0000", // Default color for regions
  },
  type: {
    type: String,
    enum: ["text", "photo"], // Type of region: either "text" or "photo"
    required: true, // Ensure the region has a type
  },
  
});

const AddEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true, // Ensure unique title
  },
  description: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  regions: {
    type: [regionSchema], // Array of region objects with shape and other data
    default: [],
  },
});

module.exports = mongoose.model("AddEvent", AddEventSchema);
