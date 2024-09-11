const mongoose = require('mongoose')


const policyAcknowledgementSchema = new mongoose.Schema({
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },

    policyVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PolicyVersion',
      required: true,
    },

    acknowledgedAt: {
      type: Date,
      default: Date.now,
    },

    isPeriodic: {
      type: Boolean,
      default: false,
    },
    
    triggerType: {
      type: String,
      enum: ['Joining', 'Periodic', 'Manual'],
      required: true,
    }
  });
  
  const PolicyAcknowledgement = mongoose.model('PolicyAcknowledgement', policyAcknowledgementSchema);
  module.exports = PolicyAcknowledgement;
  