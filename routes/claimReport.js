const express = require('express');
const router = express.Router();
const ClaimEntry = require('../models/claimEntry')
const PDFDocument = require('pdfkit');
const PDFTable = require('pdfkit-table');

const { getClaim } = require('../controller/claimReportController');

router.get('/getclaimEntry', getClaim)


// routes/claimReportRoutes.js
router.put('/submitClaims', async (req, res) => {
  try {
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);

    // Find unsubmitted claims
    const unsubmittedClaims = await ClaimEntry.find({
      $or: [{ submission_date: null }, { submission_date: '' }]
    });

    if (unsubmittedClaims.length === 0) {
      return res.status(200).json({ message: 'No unsubmitted claims found.', prId: '', submission_date: '' });
    }

    // Count how many claims are submitted today to generate PR ID
    const countToday = await ClaimEntry.countDocuments({
      submission_date: {
        $gte: new Date(formattedDate + 'T00:00:00.000Z'),
        $lte: new Date(formattedDate + 'T23:59:59.999Z')
      }
    });
    const prId = `PR-${today.getFullYear()}-${String(countToday + 1).padStart(3, '0')}`;

    // Update all unsubmitted claims with submission date and PR ID
    await ClaimEntry.updateMany(
      { _id: { $in: unsubmittedClaims.map((c) => c._id) } },
      {
        $set: {
          submission_date: today,
          status: 'Submitted to Principal',
          payment_report_id: prId
        }
      }
    );

    // Return PR ID and submission date JSON (frontend will fetch data again and generate PDF)
    return res.status(200).json({ message: 'Claims submitted successfully', prId, submission_date: today.toISOString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;