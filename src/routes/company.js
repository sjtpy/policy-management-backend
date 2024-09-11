// server.js
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Company = require('../models/company');
const Employee = require('../models/employee')
const router = express.Router()

// POST route to create a new company
router.post('/', async (req, res) => {
  const { companyName, ceoId } = req.body;

  try {
    let ceo = null;
    if (ceoId) {
      ceo = await Employee.findById(ceoId);
      if (!ceo) {
        return res.status(400).json({ message: 'CEO not found' });
      }
    }

    const newCompany = new Company({
      companyName,
      ceo: ceo ? ceo._id : null, 
    });

    await newCompany.save();

    if (ceo) {
      ceo.company_id = newCompany._id;
      await ceo.save();
    }
    
    res.status(201).json({ message: 'Company created successfully', company: newCompany });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', err });
  }
});
module.exports = router;
