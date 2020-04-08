const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const fileUpload = require("../../middlewares/fileUpload");

router.get("/", userController.getUsersData);

router.post("/register", userController.register);

router.patch(
  "/edit-account/:userID",
  fileUpload.single("profileImage"),
  userController.patchEditUserAccount
);

router.patch("/pin-account/:userID", userController.patchUserPIN);

router.delete("/delete-account/:userID", userController.deleteUserAccount);

module.exports = router;
