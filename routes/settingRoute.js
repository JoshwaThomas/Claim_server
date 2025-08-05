const express = require('express')
const router = express.Router();
const { getUser, addUser, deleteUser } = require('../controller/settingController')

router.get('/getUser', getUser)
router.post('/addUser', addUser)
router.delete('/deleteUser/:id', deleteUser)




module.exports = router;