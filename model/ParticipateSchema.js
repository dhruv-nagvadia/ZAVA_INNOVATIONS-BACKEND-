// const mongoose = require('mongoose');

// const ParticipateSchema = new mongoose.Schema({
//   eventId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Event', 
//     required: true,
//   },
//   fullName: {
//     type: String,
//     required: true,
//     trim: true, 
//   },
//   contactNumber: {
//     type: String,
//     required: true,
//     match: /^[0-9]{10}$/, // Validate that the contact number is 10 digits
//   },
//   image: {
//     type: String,
//     required: true, // Store the path to the uploaded image
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model('Participant', ParticipateSchema);

const mongoose = require('mongoose');

const participateSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
  },
  contactNo: { 
    type: String, 
    required: true 
  },
  photo: { 
    type: String, 
    required: true 
  },
  createdAt: {  
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Participant', participateSchema);
