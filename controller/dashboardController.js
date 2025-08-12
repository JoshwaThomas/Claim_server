const Claim = require('../models/claimEntry');

const getClaimCount = async (req, res) => {
  try {
    const result = await Claim.aggregate([
      {
        $group: {
          _id: null,
          totalClaims: { $sum: 1 },
          totalAmount: { $sum: '$amount' } // assuming each claim has an 'amount' field
        }
      }
    ]);

    const { totalClaims, totalAmount } = result[0] || { totalClaims: 0, totalAmount: 0 };

    res.status(200).json({ totalClaims, totalAmount });
  } catch (error) {
    console.error('Error fetching claim stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStaff = async(req, res)=>{

}

module.exports = { getClaimCount, getStaff };
