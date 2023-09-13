const express = require('express');
const passwordcode = require('../Controller/password');
const middleware = require('../Controller/middleware')
const router = express.Router();

router.post('/sendcode', passwordcode.sendAuthCode);
router.post('/passwordretrieval', passwordcode.passwordretrieval);
router.post('/changePassword',middleware.verifyToken, passwordcode.changePassword)
module.exports = router;