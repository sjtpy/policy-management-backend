const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },

    role: {
      type: String,
      required: true,
    },

    dateOfJoining: {
      type: Date,
      required: true,
    },

    username: {
        type: String,
        required: true, 
    },

    password: {
        type: String,
        required: true,
    }
  });
  
  const Employee = mongoose.model('Employee', employeeSchema);
  module.exports = Employee;
  