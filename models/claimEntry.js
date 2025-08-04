const mongoose = require('mongoose');

const claimEntrySchema = new mongoose.Schema({
  claim_type_name: { type: String, required: true },
  staff_id: { type: String, required: true },
  staff_name: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  internal_external: { type: String, required: true },
  phone_number: { type: String, required: true },
  email: { type: String, required: true },
  entry_date: { type: Date, required: true },
  submission_date: { type: Date },
  credited_date: { type: Date },
  amount: { type: Number, required: true },
  remarks: { type: String, required:false },
  bank_name: { type: String, required:false },
  branch_name: { type: String, required:false },
  branch_code: { type: String, required:false},
  ifsc_code: { type: String, required: true },
  account_no: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('ClaimEntry', claimEntrySchema);
