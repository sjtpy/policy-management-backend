const mongoose = require('mongoose')

const policyVersionSchema = new mongoose.Schema({
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
    required: true,
  },

  versionNumber: {
    type: Number,
    required: true,
  },

  content: {
    type: String,
  },

  configuration: { 
    type: Map, 
    of: String, 
    default: {} 
  },
  
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  
  approvedAt: { 
    type: Date,
  },

  isActive: {
    type: Boolean,
    default: false,
  },
  
  effectiveFrom: {
    type: Date,
  },
  
  approvalStatus: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const PolicyVersion = mongoose.model('PolicyVersion', policyVersionSchema);
module.exports = PolicyVersion;
