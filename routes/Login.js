const express = require('express');
const router = express.Router();
const RegisterSchema = require('../model/RegisterSchema'); // User schema
const AdminRegisterSchema = require('../model/adminRegisterSchema'); // Admin schema

router.post('/user', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await RegisterSchema.findOne({ email, password });
    if (user) {
      res.status(200).json({ success: true, message: 'User login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid user credentials' });
    }
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin login
router.post('/admin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await AdminRegisterSchema.findOne({ email, password, isAdmin: true });
    console.log(admin);
    if (admin) {
      res.status(200).json({ success: true, message: 'Admin login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
