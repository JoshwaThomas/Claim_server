const express = require('express');
const router = express.Router();
const {getClaimCount, getStaff} = require('../controller/dashboardController');

router.get('/totalclaimscount', getClaimCount)
router.get('/staffoverview', getStaff)


module.exports = router;