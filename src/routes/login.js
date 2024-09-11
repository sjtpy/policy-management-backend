const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee'); // Assuming Employee model is in the models directory
const router = express.Router()

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const employee = await Employee.findOne({ username });
    if (!employee) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (employee.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: employee._id, role: employee.role }, "SECRET", { expiresIn: '24h' });
    const userData = JSON.stringify({
      username: employee.username,
      userId: employee._id,
      role: employee.role,
      companyId: employee.companyId
    });
    res.cookie('userData', userData, {
      secure: false,  
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

module.exports = router;