const ClaimEntry = require('../models/claimEntry');

const getClaim = async (req, res) => {
  try {
    const entries = await ClaimEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error('Error fetching claim entries:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getClaim };
