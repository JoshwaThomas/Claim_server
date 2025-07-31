const mongoose = require('mongoose');

const ClaimTypeSchema = new mongoose.Schema({
  claim_type_name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ClaimType', ClaimTypeSchema);
