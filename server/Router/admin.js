const express = require('express');
const middleware = require('../Controller/middleware')
const router = express.Router();
const adminController = require('../Controller/adminController')

router.get('/getalluser',middleware.verifyAdmin, adminController.getallUser);
router.get('/getallacction',middleware.verifyAdmin, adminController.getallAction);

module.exports = router;