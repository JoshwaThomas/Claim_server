// const express = require('express');
// const router = express.Router();
// const claimEntry = require('../models/claimEntry');

// // Get all PR IDs with claim counts
// router.get('/pr-ids', async (req, res) => {
//   try {
//     const grouped = await claimEntry.aggregate([
//       {
//         $match: {
//           payment_report_id: { $exists: true, $ne: null },
//           $or: [
//             { credited_date: { $exists: false } },
//             { credited_date: null }
//           ]
//         }
//       },
//       {
//         $group: {
//           _id: '$payment_report_id',
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $project: {
//           payment_report_id: '$_id',
//           count: 1,
//           _id: 0
//         }
//       }
//     ]);

//     res.json(grouped);
//   } catch (err) {
//     console.error('Error fetching filtered PR IDs:', err);
//     res.status(500).json({ error: 'Failed to fetch PR IDs' });
//   }
// });


// // Get claims by PR ID
// router.get('/claims/:prId', async (req, res) => {
//   try {
//     const claims = await claimEntry.find({ payment_report_id: req.params.prId });
//     res.json(claims);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch claims' });
//   }
// });

// // Update credited date and remarks
// router.put('/update/:id', async (req, res) => {
//   try {
//     const { credited_date, remarks } = req.body;
//     const updated = await claimEntry.findByIdAndUpdate(
//       req.params.id,
//       {
//         credited_date,
//         remarks,
//         status: credited_date ? 'Credited' : 'Pending'
//       },
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to update claim' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const claimEntry = require('../models/claimEntry');
const nodemailer = require('nodemailer');



// Setup transporter (use Gmail or any SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password' // Use App Password if 2FA is enabled
  }
});

// Function to send email
const sendCreditedEmail = async (recipientEmail, staffName, amount) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: recipientEmail,
    subject: '💰 Claim Credited Notification',
    text: `Dear ${staffName},\n\nYour claim of ₹${amount} has been successfully credited via NEFT.\n\nRegards,\nFinance Team`
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Get all PR IDs with claim counts (only for claims submitted to Principal and not yet credited)
router.get('/pr-ids', async (req, res) => {
  try {
    const grouped = await claimEntry.aggregate([
      {
        $match: {
          payment_report_id: { $exists: true, $ne: null },
          status: 'Submitted to Principal',
          $or: [
            { credited_date: { $exists: false } },
            { credited_date: null }
          ]
        }
      },
      {
        $group: {
          _id: '$payment_report_id',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          payment_report_id: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json(grouped);
  } catch (err) {
    console.error('Error fetching filtered PR IDs:', err);
    res.status(500).json({ error: 'Failed to fetch PR IDs' });
  }
});

// ✅ Get claims by PR ID (only those submitted to Principal)
router.get('/claims/:prId', async (req, res) => {
  try {
    const claims = await claimEntry.find({
      payment_report_id: req.params.prId,
      status: 'Submitted to Principal'
    });
    res.json(claims);
  } catch (err) {
    console.error('Error fetching claims by PR ID:', err);
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

// ✅ Update credited date and remarks (and update status accordingly)
router.put('/update/:id', async (req, res) => {
  try {
    const { credited_date, remarks } = req.body;

    const updated = await claimEntry.findByIdAndUpdate(
      req.params.id,
      {
        credited_date,
        remarks,
        status: credited_date ? 'Credited' : 'Submitted to Principal'
      },
      { new: true }
    );

    // Send email after update
    if (updated.status === 'Credited' && updated.staff_email) {
      await sendCreditedEmail(updated.staff_email, updated.staff_name, updated.amount);
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating claim:', err);
    res.status(500).json({ error: 'Failed to update claim' });
  }
});


module.exports = router;
