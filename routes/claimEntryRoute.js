const express = require('express');
const router = express.Router();
const Staff = require('../models/staffmanage');

// Route: GET /api/getStaffByPhone/:phone
router.get('/getStaffByPhone/:phone', async (req, res) => {
  try {
    const staff = await Staff.findOne({ phone_no: req.params.phone });

    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.json({
      staff_id: staff.staff_id,
      staff_name: staff.staff_name,
      department: staff.department,
      designation: staff.designation
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
