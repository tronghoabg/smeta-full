const express = require('express');
const middleware = require('../Controller/middleware')
const router = express.Router();
const adminController = require('../Controller/adminController')

router.get('/getalluser',middleware.verifyTokenAndAdmin, adminController.getallUser);
router.get('/getallacction',middleware.verifyTokenAndAdmin, adminController.getallAction);
router.get('/getallpayment',middleware.verifyTokenAndAdmin, adminController.AdmingetAllpayment);
router.get('/getpaymentmost',middleware.verifyTokenAndAdmin, adminController.getmosttimepayment);
router.get('/getallpaymentadmin',middleware.verifyTokenAndAdmin, adminController.getallpayment);
router.get('/getadminoption',middleware.verifyTokenAndAdmin, adminController.getadminoption);
router.get('/getuserbuyid/:profileId',middleware.verifyTokenAndAdmin, adminController.getUserBuyId);

// router.get('/serachuser',middleware.verifyTokenAndAdmin, adminController.serachuser);
module.exports = router;


