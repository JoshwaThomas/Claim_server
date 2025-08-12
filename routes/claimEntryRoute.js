// routes/claims.js
const express = require('express');
const router = express.Router();
const Staff = require('../models/staffmanage');
const ClaimEntry = require('../models/claimEntry');
const ClaimType = require('../models/claimtype')

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



router.post('/calculateAmount', async (req, res) => {
  try {
    const { claim_type_name, qps_level, no_of_qps, no_of_papers } = req.body;

    if (!claim_type_name) {
      return res.status(400).json({ message: 'Claim type is required' });
    }

    const claim = await ClaimType.findOne({ claim_type_name });
    if (!claim) {
      return res.status(404).json({ message: 'Claim type not found' });
    }

    const settings = claim.amount_settings || {};
    let amount = 0;

    switch (claim_type_name) {
      case 'QPS':
        if (!qps_level || !no_of_qps) {
          return res.status(400).json({ message: 'Missing QPS level or count' });
        }

        const qpsRate =
          qps_level === 'UG'
            ? settings.qps_ug_amount || 0
            : qps_level === 'PG'
              ? settings.qps_pg_amount || 0
              : 0;

        amount = qpsRate * parseInt(no_of_qps);
        break;

      case 'CIA REAPEAR CLAIM':
        if (!no_of_papers) {
          return res.status(400).json({ message: 'Missing number of papers' });
        }

        const ciaRate = settings.cia_reval_amount || 0;
        amount = ciaRate * parseInt(no_of_papers);
        break;
      case 'SCRUTINY CLAIM':
        const { scrutiny_level, scrutiny_no_of_papers, scrutiny_days } = req.body;

        if (!scrutiny_level || isNaN(scrutiny_no_of_papers) || isNaN(scrutiny_days)) {
          return res.status(400).json({ message: 'Missing scrutiny level, papers, or days' });
        }

        const paperRate =
          scrutiny_level === 'UG'
            ? claim.amount_settings?.scrutiny_ug_rate || 0
            : scrutiny_level === 'PG'
              ? claim.amount_settings?.scrutiny_pg_rate || 0
              : 0;

        const dayRate = claim.amount_settings?.scrutiny_day_rate || 0;

        amount =
          paperRate * parseInt(scrutiny_no_of_papers) +
          dayRate * parseInt(scrutiny_days);
        break;

      case 'CENTRAL VALUATION':
        const {
          total_scripts,
          days_halted,
          travel_allowance,
          tax_applicable // only "AIDED" or "SF"
        } = req.body;

        if (
          isNaN(total_scripts) ||
          isNaN(days_halted) ||
          isNaN(travel_allowance)
        ) {
          return res.status(400).json({ message: 'Missing or invalid Central Valuation inputs' });
        }

        const scriptRate = claim.amount_settings?.script_rate || 0;
        const haltRate = claim.amount_settings?.halt_day_rate || 0;

        const totalScriptsAmount = scriptRate * parseInt(total_scripts);
        const haltAmount = haltRate * parseInt(days_halted);
        const travelAmount = parseFloat(travel_allowance);

        const total = totalScriptsAmount + haltAmount + travelAmount;

        // ✅ Apply 10% tax reduction only if AIDED
        const tax = tax_applicable === 'AIDED' ? total * 0.1 : 0;

        amount = total - tax;
        break;




      default:
        return res.status(400).json({ message: 'Unsupported claim type' });
    }

    res.status(200).json({ amount });
  } catch (error) {
    console.error('Error calculating amount:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
