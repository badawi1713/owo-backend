const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

require("dotenv").config();
const sgMail = require("@sendgrid/mail");

router.post("/register", authController.register);
router.post("/login", authController.loginUser);

// Forgot password
// otp
// logout

module.exports = router;
