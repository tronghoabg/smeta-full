const express = require('express');
const middleware = require('../Controller/middleware')
const paymentControllers =  require('../Controller/paymentControllers')
const router = express.Router();

router.post('/postpayment',middleware.verifyToken, paymentControllers.creatPayment);
router.get('/getuserpayment',middleware.verifyToken, paymentControllers.getuserpayment);

module.exports = router;