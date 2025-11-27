const express = require('express');
const router = express.Router();
const {getClaimCount, getStaffCount} = require('../controller/dashboardController');

router.get('/totalclaimscount', getClaimCount)
router.get("/staffcount", getStaffCount);


module.exports = router;