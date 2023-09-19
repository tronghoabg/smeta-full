const express = require('express');
const middleware = require('../Controller/middleware')
const router = express.Router();
const adminController = require('../Controller/adminController')

router.get('/getalluser', adminController.getallUser);
router.get('/getallacction', adminController.getallAction);

module.exports = router;