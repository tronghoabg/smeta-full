const express = require('express');
const middleware = require('../Controller/middleware')
const buypackageControllers =  require('../Controller/buypackageControllers')
const router = express.Router();

router.get('/getallprouct', buypackageControllers.getAllProduct);
router.post('/buyer',middleware.verifyToken, buypackageControllers.buypackage);
router.post('/checkedaction',middleware.verifyToken, buypackageControllers.updatePackage);

module.exports = router;