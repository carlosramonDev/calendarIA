const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser } = require('../models/User');

// Mock database for users
let users = [];

// Register User
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = createUser(username, email, hashedPassword);
  newUser.id = users.length + 1; // Simple ID generation
  users.push(newUser);

  // Create and sign JWT
  const payload = {
    user: {
      id: newUser.id,
      username: newUser.username,
    },
  };

  jwt.sign(
    payload,
    'jwtSecret', // Replace with a strong secret from config
    { expiresIn: '1h' },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ msg: 'Invalid Credentials' });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid Credentials' });
  }

  // Create and sign JWT
  const payload = {
    user: {
      id: user.id,
      username: user.username,
    },
  };

  jwt.sign(
    payload,
    'jwtSecret', // Replace with a strong secret from config
    { expiresIn: '1h' },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});

module.exports = router;
