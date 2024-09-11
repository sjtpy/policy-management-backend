const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const PolicyTemplate = require('../models/policyTemplate');
const Policy = require('../models/policy')
const checkRole = require("../middleware/checkRole")
const PolicyVersion = require("../models/policyVersion")
router = express.Router()

router.post('/', async (req, res) => {
  const { templateName, templateContent, complianceFramework, version } = req.body;

  try {
    const exists= await PolicyTemplate.findOne({ templateName });
    if (exists) {
      return res.status(400).json({ message: 'Template already exists' });
    }

    const newTemplate = new PolicyTemplate({
        templateName, 
        templateContent,
        complianceFramework,
        version
    });

    await newTemplate.save();
    
    res.status(201).json({ message: 'Template created successfully', template: newTemplate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', err });
  }
});

router.get('/', async (req, res) => {

  try {
    const templates= await PolicyTemplate.find({})
    
    res.status(201).json({ templates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', err });
  }
});

router.put('/:templateId', async (req, res) => {
  const { templateContent } = req.body;
  const { templateId } = req.params;

  try {
    const template = await PolicyTemplate.findById(templateId);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    template.templateContent = templateContent;
    template.version += 1;
    await template.save();
    
    const associatedPolicies = await Policy.find({ templateId, isCustom: false });
    
    for (const policy of associatedPolicies) {
      const latestVersion = await PolicyVersion.findOne({ policyId: policy._id }).sort({ versionNumber: -1 });
      const newVersion = new PolicyVersion({
        policyId: policy._id,
        versionNumber: latestVersion.versionNumber + 1,
        content: templateContent, 
        configuration: latestVersion.configuration,  
        approvalStatus: 'Pending', 
      });

      await newVersion.save();
    }
    
    res.status(200).json({ message: 'Template updated, new policy versions created for non-custom policies' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});



module.exports = router;