const express = require('express');
const router = express.Router();
const ClaimEntry = require('../models/claimEntry')

const { getClaim } = require('../controller/claimReportController');

router.get('/getclaimEntry', getClaim)

// routes/claimReportRoutes.js
router.put('/submitClaims', async (req, res) => {
    try {
        const today = new Date();
        const formattedDate = today.toISOString().slice(0, 10); // e.g., "2025-08-26"

        // Step 1: Find unsubmitted claims
        const unsubmittedClaims = await ClaimEntry.find({
            $or: [{ submission_date: null }, { submission_date: '' }]
        });

        if (unsubmittedClaims.length === 0) {
            return res.status(200).json({ message: 'No unsubmitted claims found.' });
        }

        // Step 2: Generate PR ID
        const countToday = await ClaimEntry.countDocuments({
            submission_date: {
                $gte: new Date(formattedDate + 'T00:00:00.000Z'),
                $lte: new Date(formattedDate + 'T23:59:59.999Z')
            }
        });

        const prId = `PR-${today.getFullYear()}-${String(countToday + 1).padStart(3, '0')}`;

        // Step 3: Update all unsubmitted claims
        const result = await ClaimEntry.updateMany(
            { _id: { $in: unsubmittedClaims.map((c) => c._id) } },
            {
                $set: {
                    submission_date: today,
                    status: 'Submitted to Principal',
                    payment_report_id: prId
                }
            }
        );

        res.json({
            message: 'Claims submitted successfully',
            updatedCount: result.modifiedCount,
            paymentReportId: prId
        });
    } catch (error) {
        console.error('Error submitting claims batch:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;