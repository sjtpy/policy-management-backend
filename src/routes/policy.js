const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Policy = require('../models/policy')
const PolicyVersion = require('../models/policyVersion')
const PolicyTemplate = require('../models/policyTemplate')
const PolicyAcknowledgement = require('../models/policyAcknowledgement')
const router = express.Router()
const checkRole = require("../middleware/checkRole")

router.post('/', checkRole(['hr']), async (req, res) => {
  const { templateId, configuration, policyContent } = req.body;
  const userData = JSON.parse(req.cookies.userData)
  try {
    const newPolicy = new Policy({
      companyId: userData.companyId,
      isCustom: !templateId,
      templateId,
      createdAt: new Date(),
    });
    await newPolicy.save();

    const newPolicyVersion = new PolicyVersion({
      policyId: newPolicy._id,
      versionNumber: 1, 
      content: policyContent || '',  
      configuration: configuration || {},  
      isActive: true, 
      approvedBy: null,
      approvalStatus: 'Pending',
      createdAt: new Date(),
    });

    await newPolicyVersion.save();
    res.status(201).json({ message: 'Policy created successfully', policy: newPolicy });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});


router.get('/', checkRole(['ceo']), async (req, res) => {
  try {
    const policies = await Policy.find({});
    res.status(200).json(policies);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});

router.get('/approved',checkRole(['employee']), async (req, res) => {
  try {
    const userData = JSON.parse(req.cookies.userData);
    const policies = await Policy.find({ approvalStatus: 'Approved', companyId: userData.companyId });
    res.status(200).json(policies);
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});


router.get('/policyversions', async (req, res) => {
  const { status } = req.query;
  if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status parameter' });
  }
  try {
    const policyVersions = await PolicyVersion.find({ approvalStatus: status }).populate('policyId');

    if (!policyVersions.length) {
      return res.status(200).json({});
    }
    const enrichedPolicyVersions = [];
    for (const version of policyVersions) {
      const { isCustom, templateId } = version.policyId;

      let policyContent;

      if (isCustom) {
        policyContent = version.content;
      } else {
        const template = await PolicyTemplate.findById(templateId);

        if (!template) {
          return res.status(404).json({ message: `Template not found for templateId ${templateId}` });
        }

        policyContent = template.templateContent;
      }
      enrichedPolicyVersions.push({ ...version._doc, policyContent });
    }

    res.status(200).json(enrichedPolicyVersions);
  } catch (error) {
    console.error('Error fetching policy versions:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


router.post('/approve/:id', checkRole(['ceo']), async (req, res) => {
  try {
    const policyVersionId = req.params.id;
    const userData = JSON.parse(req.cookies.userData);
    const policyVersion = await PolicyVersion.findById(policyVersionId);

    if (!policyVersion) {
      return res.status(404).json({ message: 'Policy version not found' });
    }

    policyVersion.isActive = true;
    policyVersion.approvedBy = userData.userId;
    policyVersion.approvedAt = new Date();
    policyVersion.approvalStatus = 'Approved'

    await policyVersion.save();

    res.status(200).json({ message: 'Policy version approved successfully' });
  } catch (error) {
    console.error('Error approving policy version:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/acknowledge',checkRole(['employee']), async (req, res) => {
  try {
    const { employeeId, policyVersionId, isPeriodic, triggerType } = req.body;

    if (!employeeId || !policyVersionId || !triggerType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['Joining', 'Periodic', 'Manual'].includes(triggerType)) {
      return res.status(400).json({ message: 'Invalid triggerType' });
    }

    const newAcknowledgement = new PolicyAcknowledgement({
      employeeId,
      policyVersionId,
      isPeriodic,
      triggerType
    });

    const savedAcknowledgement = await newAcknowledgement.save();

    res.status(201).json(savedAcknowledgement);
  } catch (error) {
    console.error('Error creating policy acknowledgement:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


router.get('/acknowledgements/:employeeId', async (req, res) => {
  const { employeeId } = req.params;

  try {
    const acknowledgements = await PolicyAcknowledgement.find({ employeeId });
    res.status(200).json(acknowledgements);
  } catch (error) {
    console.error('Error fetching acknowledged policies:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


module.exports = router;