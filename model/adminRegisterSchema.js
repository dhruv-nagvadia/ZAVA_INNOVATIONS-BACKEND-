const mongoose = require('mongoose');

const adminRegisterSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  isAdmin: { 
    type: Boolean, 
    required: true, 
    default: true 
  },
});

module.exports = mongoose.model('adminregister', adminRegisterSchema);
