const claims = require('../models/claimtype');

const getClaims = async (req, res) => {
    try {
        const data = await claims.find();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const addClaim = async (req, res) => {
    const { name, description } = req.body;

    try {
        const newClaim = await claims.create({ claim_type_name: name, description })

        res.status(201).json({
            message: 'Claim added successfully',
            data: newClaim
        });
    } catch (error) {
        console.error('Error adding claim:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const deleteClaim =  async (req, res) => {
  try {
    const deletedClaim = await claims.findByIdAndDelete(req.params.id);
    if (!deletedClaim) return res.status(404).json({ message: 'Claim not found' });

    res.json({ message: 'Claim deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = { getClaims, addClaim, deleteClaim };
