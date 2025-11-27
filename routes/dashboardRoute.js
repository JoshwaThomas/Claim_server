const express = require('express');
const router = express.Router();
const {getClaimCount, getStaffCount, getCreditedClaims, getPendingClaims, getAwaitingClaims, getInternalExternalClaims} = require('../controller/dashboardController');

router.get('/totalclaimscount', getClaimCount)
router.get("/staffcount", getStaffCount);
router.get("/creditedclaims", getCreditedClaims);
router.get("/pendingclaims", getPendingClaims);
router.get("/awaitingclaims", getAwaitingClaims);
router.get("/internalexternalclaims", getInternalExternalClaims);





module.exports = router;