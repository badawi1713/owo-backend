const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.post("/", transactionController.postNewTransaction);
router.patch("/top-up/:userID", transactionController.updateUserBalance);

module.exports = router;
