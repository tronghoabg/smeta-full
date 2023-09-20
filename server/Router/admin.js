const express = require('express');
const middleware = require('../Controller/middleware')
const router = express.Router();
const adminController = require('../Controller/adminController')

router.get('/getalluser',middleware.verifyTokenAndAdmin, adminController.getallUser);
router.get('/getallacction',middleware.verifyTokenAndAdmin, adminController.getallAction);

module.exports = router;