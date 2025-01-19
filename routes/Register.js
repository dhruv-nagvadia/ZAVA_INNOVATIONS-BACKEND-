const express = require('express');
const Register = require('../model/RegisterSchema');  
const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password, email } = req.body;
  console.log('username',username);
  console.log('pass',password);
  console.log('email',email);

  try {
    const existingUser = await Register.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const newUser = new Register({
      username,
      password,  
      email
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

module.exports = router;
