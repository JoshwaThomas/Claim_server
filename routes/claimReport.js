const express = require('express');
const router = express.Router();

const {getClaim} = require('../controller/claimReportController');

router.get('/getclaimEntry', getClaim)

module.exports = router;