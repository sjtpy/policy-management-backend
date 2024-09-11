const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');
router = express.Router()

router.post('/', async (req, res) => {
  const { companyId, role, dateOfJoining, username, password } = req.body;
  try {
    const exists= await Employee.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    const newEmployee = new Employee({
      companyId,
      role,
      dateOfJoining,
      username,
      password,
    });

    await newEmployee.save();
    
    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', err });
  }
});

module.exports = router;