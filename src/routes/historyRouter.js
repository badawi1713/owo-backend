const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

router.get("/:userID", historyController.getAllHistoryTransaction);
router.get("/detail/:historyID", historyController.getDetailTransactionHistory);

module.exports = router;
