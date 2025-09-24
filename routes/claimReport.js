const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const ClaimEntry = require('../models/claimEntry');
const PDFDocument = require('pdfkit');
=======
const ClaimEntry = require('../models/claimEntry')
const PDFDocument = require('pdfkit');
const PDFTable = require('pdfkit-table');

>>>>>>> d6c50a74005c16add69ec7a77552f38bcaebaaac
const { getClaim } = require('../controller/claimReportController');



<<<<<<< HEAD

// 🔹 Fetch all claims
router.get('/getclaimEntry', getClaim);

// 🔹 Submit all unsubmitted claims
router.put('/submitClaims', async (req, res) => {
  try {
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);

    const unsubmittedClaims = await ClaimEntry.find({
      $or: [{ submission_date: null }, { submission_date: '' }]
    });

    if (unsubmittedClaims.length === 0) {
      return res.status(200).json({ message: 'No unsubmitted claims found.' });
    }

    const countToday = await ClaimEntry.countDocuments({
      submission_date: {
        $gte: new Date(`${formattedDate}T00:00:00.000Z`),
        $lte: new Date(`${formattedDate}T23:59:59.999Z`)
      }
    });

    const prId = `PR-${today.getFullYear()}-${String(countToday + 1).padStart(3, '0')}`;

    const result = await ClaimEntry.updateMany(
=======
// routes/claimReportRoutes.js
router.put('/submitClaims', async (req, res) => {
  try {
    const { claimType } = req.body; // Get selected claim type
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);

    // Build filter for unsubmitted claims, with optional claim type
    const baseFilter = {
      $or: [{ submission_date: null }, { submission_date: '' }]
    };
    if (claimType && claimType !== 'all') {
      baseFilter.claim_type_name = claimType;
    }

    const unsubmittedClaims = await ClaimEntry.find(baseFilter);

    if (unsubmittedClaims.length === 0) {
      return res.status(200).json({ message: 'No unsubmitted claims found.', prId: '', submission_date: '' });
    }

    // Count how many claims submitted today for PR ID
    const countToday = await ClaimEntry.countDocuments({
      submission_date: {
        $gte: new Date(formattedDate + 'T00:00:00.000Z'),
        $lte: new Date(formattedDate + 'T23:59:59.999Z')
      }
    });
    const prId = `PR-${today.getFullYear()}-${String(countToday + 1).padStart(3, '0')}`;

    // Update only matched unsubmitted claim entries
    await ClaimEntry.updateMany(
>>>>>>> d6c50a74005c16add69ec7a77552f38bcaebaaac
      { _id: { $in: unsubmittedClaims.map((c) => c._id) } },
      {
        $set: {
          submission_date: today,
          status: 'Submitted to Principal',
          payment_report_id: prId
        }
      }
    );

<<<<<<< HEAD
    res.json({
      message: 'Claims submitted successfully',
      updatedCount: result.modifiedCount,
      paymentReportId: prId
    });
  } catch (error) {
    console.error('Error submitting claims batch:', error.message);
=======
    return res.status(200).json({ message: 'Claims submitted successfully', prId, submission_date: today.toISOString() });
  } catch (error) {
    console.error(error);
>>>>>>> d6c50a74005c16add69ec7a77552f38bcaebaaac
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

<<<<<<< HEAD
// 🔹 Submit filtered claims only
router.put('/submitFilteredClaims', async (req, res) => {
  try {
    const { claimIds } = req.body;
    if (!Array.isArray(claimIds) || claimIds.length === 0) {
      return res.status(400).json({ message: 'No claims selected' });
    }

    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);

    const countToday = await ClaimEntry.countDocuments({
      submission_date: {
        $gte: new Date(`${formattedDate}T00:00:00.000Z`),
        $lte: new Date(`${formattedDate}T23:59:59.999Z`)
      }
    });

    const prId = `PR-${today.getFullYear()}-${String(countToday + 1).padStart(3, '0')}`;

    await ClaimEntry.updateMany(
      { _id: { $in: claimIds } },
      {
        $set: {
          submission_date: today,
          status: 'Submitted to Principal',
          payment_report_id: prId
        }
      }
    );

    res.json({
      message: 'Filtered claims submitted successfully',
      paymentReportId: prId
    });
  } catch (error) {
    console.error('Error submitting filtered claims:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 🔹 Download submitted claims as styled PDF
router.get('/downloadSubmittedClaims/:prId', async (req, res) => {
  try {
    const { prId } = req.params;
    const claims = await ClaimEntry.find({ payment_report_id: prId });

    if (!claims || claims.length === 0) {
      return res.status(404).send('No claims found for this PR ID');
    }

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ClaimReport_${prId}.pdf`);
    doc.pipe(res);

    // Header
    doc.fontSize(20).fillColor('#333').text('Claim Report', { align: 'center' });
    doc.fontSize(14).fillColor('#555').text(`Payment Report ID: ${prId}`, { align: 'center' });
    doc.moveDown(1);

    // Table Header
    const headers = ['No.', 'Claim Type', 'Staff Name', 'Amount', 'Department'];
    const positions = [50, 90, 200, 360, 430];

    doc.fontSize(11).fillColor('black').font('Helvetica-Bold');
    headers.forEach((header, i) => {
      doc.text(header, positions[i], doc.y);
    });
    doc.moveDown(0.3);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // Table Rows
    let totalAmount = 0;
    doc.font('Helvetica').fontSize(10);

    claims.forEach((claim, index) => {
      const y = doc.y;
      if (index % 2 === 0) {
        doc.rect(50, y, 500, 18).fill('#f5f5f5').fillColor('black');
      }

      doc.text(index + 1, positions[0], y + 4);
      doc.text(claim.claim_type_name, positions[1], y + 4);
      doc.text(claim.staff_name, positions[2], y + 4);
      doc.text(`₹${claim.amount}`, positions[3], y + 4);
      doc.text(claim.department, positions[4], y + 4);

      doc.moveDown(1);
      totalAmount += claim.amount;
    });

    // Footer
    doc.moveDown(1);
    doc.font('Helvetica-Bold').fontSize(12).text(`Total Amount: ₹${totalAmount}`, { align: 'right' });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    res.status(500).send('Failed to generate PDF');
  }
});

module.exports = router;
=======
module.exports = router;



// router.put('/submitClaims', async (req, res) => {
//   try {
//     const { claimType } = req.body; // Get selected claim type
//     const today = new Date();
//     const formattedDate = today.toISOString().slice(0, 10);

//     // Build filter for unsubmitted claims, with optional claim type
//     const baseFilter = {
//       $or: [{ submission_date: null }, { submission_date: '' }]
//     };
//     if (claimType && claimType !== 'all') {
//       baseFilter.claim_type_name = claimType;
//     }

//     const unsubmittedClaims = await ClaimEntry.find(baseFilter);

//     if (unsubmittedClaims.length === 0) {
//       return res.status(200).json({ message: 'No unsubmitted claims found.', prId: '', submission_date: '' });
//     }

//     // Find the last generated PR ID in all claims, sorted descending
//     const lastClaim = await ClaimEntry.findOne({ payment_report_id: { $exists: true, $ne: '' } })
//       .sort({ payment_report_id: -1 })
//       .exec();

//     let nextNumber = 1; // default starting number

//     if (lastClaim) {
//       // Extract the numeric sequence from last payment_report_id, e.g. PR-2025-010 -> 10
//       const lastPrId = lastClaim.payment_report_id;
//       const match = lastPrId.match(/PR-\d{4}-(\d{3})/);
//       if (match && match[1]) {
//         nextNumber = parseInt(match[1], 10) + 1;
//       }
//     }

//     const prId = `PR-${today.getFullYear()}-${String(nextNumber).padStart(3, '0')}`;

//     // Update only matched unsubmitted claim entries
//     await ClaimEntry.updateMany(
//       { _id: { $in: unsubmittedClaims.map((c) => c._id) } },
//       {
//         $set: {
//           submission_date: today,
//           status: 'Submitted to Principal',
//           payment_report_id: prId
//         }
//       }
//     );

//     return res.status(200).json({ message: 'Claims submitted successfully', prId, submission_date: today.toISOString() });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });
>>>>>>> d6c50a74005c16add69ec7a77552f38bcaebaaac
