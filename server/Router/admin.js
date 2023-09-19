const express = require('express');
const middleware = require('../Controller/middleware')
const router = express.Router();
const adminController = require('../Controller/adminController')

router.get('/getalluser', adminController.getallUser);


module.exports = router;