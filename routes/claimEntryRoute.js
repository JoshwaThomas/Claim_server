// routes/claims.js
const express = require('express');
const router = express.Router();
const Staff = require('../models/staffmanage');
const ClaimEntry = require('../models/claimEntry');

// GET staff details by phone
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
      designation: staff.designation,
      employment_type: staff.employment_type,
      email: staff.email,
      bank_name: staff.bank_name,
      branch_name: staff.branch_name,
      branch_code: staff.branch_code,
      ifsc_code: staff.ifsc_code,
      bank_acc_no: staff.bank_acc_no
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/postClaim', async (req, res) => {
  try {
    // console.log("Incoming data:", req.body); // Add this line
    const claim = new ClaimEntry(req.body);
    await claim.save();
    res.status(201).json({ message: "Claim saved" });
  } catch (err) {
    console.error("Error saving claim:", err.message); // Add this too
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
