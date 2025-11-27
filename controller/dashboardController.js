const Claim = require('../models/claimEntry');
const Staff = require('../models/staffmanage')

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

const getStaffCount = async (req, res) => {
  try {
    const result = await Staff.aggregate([
      {
        $group: {
          _id: "$employment_type",
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert array to object
    let internal = 0;
    let external = 0;

    result.forEach((r) => {
      if (r._id === "INTERNAL") internal = r.count;
      if (r._id === "EXTERNAL") external = r.count;
    });

    res.status(200).json({
      internal,
      external,
      total: internal + external
    });
  } catch (error) {
    console.error("Error fetching staff count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getClaimCount, getStaffCount };
