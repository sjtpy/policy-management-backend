const mongoose = require('mongoose');

const policyTemplateSchema = new mongoose.Schema({
  templateName: { 
    type: String, 
    required: true 
  },
  
  templateContent: { 
    type: String, 
    required: true 
  },

  complianceFramework: { 
    type: String, 
    required: true 
  },

  version: { 
    type: Number, 
    default: 1 
  }
});

const PolicyTemplate = mongoose.model('PolicyTemplate', policyTemplateSchema);
module.exports = PolicyTemplate;