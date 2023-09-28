const router = require("express").Router();
const authController = require('../Controller/authControllers')
const verifyToken = require('../Controller/middleware')

router.post("/register", authController.registerUser)
router.post("/login",authController.loginUser)
router.post("/refresh",authController.posttoken)
router.patch("/logout",verifyToken.verifyToken ,authController.logout)
router.get("/profile",verifyToken.verifyToken , authController.test_verifyToken)
router.patch("/updatelang",verifyToken.verifyToken , authController.updateLanguage)
router.patch("/updateinfo",verifyToken.verifyToken , authController.updateinfo)


module.exports = router