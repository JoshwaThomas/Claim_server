const express = require('express');
const router = express.Router();
const {getClaims,addClaim,deleteClaim}  = require('../controller/claimManageController')

router.get('/getClaim', getClaims)
router.post('/addclaim',addClaim )
router.delete('/deleteClaim/:id',deleteClaim)


module.exports = router;