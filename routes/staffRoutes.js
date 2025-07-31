const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const Staff = require('../models/staffmanage');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Upload route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    for (const record of data) {
      const existing = await Staff.findOne({
        $or: [
          { phone_no: record.phone_no },
          { bank_acc_no: record.bank_acc_no }
        ]
      });

      if (existing) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          error: `Duplicate found: Phone No - ${record.phone_no}, Bank A/C - ${record.bank_acc_no}`
        });
      }
    }

    await Staff.insertMany(data);
    fs.unlink(req.file.path, () => {});
    res.status(200).json({ message: '✅ Data uploaded successfully' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed. Check Excel format.' });
  }
});

// Get all staff
router.get('/', async (req, res) => {
  try {
    const filters = req.query;
    const staffList = await Staff.find(filters);
    res.status(200).json(staffList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch staff data' });
  }
});

module.exports = router;
