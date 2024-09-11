const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
  
  templateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PolicyTemplate', 
    required: false 
  },

  isCustom: { 
    type: Boolean, 
    default: false 
  },

  policyContent: { 
    type: String, 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  
});

const Policy = mongoose.model('Policy', policySchema);
module.exports = Policy;
