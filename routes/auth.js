const express = require('express');
const router = express.Router();
const { signup } = require('../services/signup');   // adjust path as needed
const { signin } = require('../services/signin');   // if you have signIn function



// Signup route
router.post('/signup', async (req, res) => {
  const { username, name, email, birthDate, password } = req.body;

  if (!username || !name || !email || !birthDate || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const success = await signup(username, name, email, birthDate, password);
    if (success) {
      return res.status(201).json({ message: 'User registered successfully' });
    } else {
      return res.status(409).json({ error: 'Username or Email already exists' });
    }
  } catch (err) {
    console.error('Signup route error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Signin route
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const user = await signin(username, password);
    if (user) {
      return res.status(200).json({ message: 'Sign-in successful', user });
    } else {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Signin route error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
