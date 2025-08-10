const express = require('express');
const router = express.Router();
const {getClaimCount} = require('../controller/dashboardController')

router.get('/totalclaimscount', getClaimCount)


module.exports = router;