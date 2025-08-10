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

  // Flexible amount settings: only include relevant keys
  amount_settings: {
    type: mongoose.Schema.Types.Mixed, // Accepts any object shape
    default: {},
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ClaimType', ClaimTypeSchema);
