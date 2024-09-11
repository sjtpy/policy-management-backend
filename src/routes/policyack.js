const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Policy = require('../models/policy')
const router = express.Router()
const checkRole = require("../middleware/checkRole")
const PolicyVersion = require("../models/policyVersion")

router.post('/acknowledge/:policyVersionId', async (req, res) => {
    const { policyVersionId } = req.params;
    const userData = JSON.parse(req.cookies.userData);
    
    try {
      const policyVersion = await PolicyVersion.findById(policyVersionId);
      if (!policyVersion || !policyVersion.isActive) {
        return res.status(404).json({ message: 'Policy version not found or not active' });
      }
  
      const existingAcknowledgement = await PolicyAcknowledgement.findOne({
        employee_id: userData._id,
        policy_version_id: policyVersionId,
      });
  
      if (existingAcknowledgement) {
        return res.status(400).json({ message: 'Policy version already acknowledged' });
      }
  

      const newAcknowledgement = new PolicyAcknowledgement({
        employee_id: userData._id,
        policy_version_id: policyVersionId,
        trigger_type: 'Manual',
      });
  
      await newAcknowledgement.save();
  
      res.status(201).json({ message: 'Policy version acknowledged successfully' });
    } catch (err) {
      console.error('Error acknowledging policy version:', err);
      res.status(500).json({ message: 'Server error', err });
    }
  });

module.exports = router;