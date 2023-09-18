const express = require('express');
const middleware = require('../Controller/middleware')
const paymentControllers =  require('../Controller/paymentControllers')
const router = express.Router();

router.post('/postpayment',middleware.verifyToken, paymentControllers.creatPayment);

module.exports = router;