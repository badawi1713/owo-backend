const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

require("dotenv").config();

router.get("/check-phone-number", authController.checkUserPhoneNumber);
router.post("/register", authController.register);
router.post("/login", authController.loginUser);

// Forgot password
// otp
// logout

module.exports = router;
