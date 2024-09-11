const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  
  ceo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  }
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
