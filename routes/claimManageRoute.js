const express = require('express');
const router = express.Router();
const {getClaims}  = require('../controller/claimManageController')

router.get('/getClaims', getClaims)


module.exports = router;