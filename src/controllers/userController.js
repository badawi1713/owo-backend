require("dotenv").config();
const userModel = require("../models/userModel");
const helper = require("../helpers/response");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

exports.getUsersData = (req, res, next) => {
  userModel
    .getAllUser()
    .then((data) => {
      console.log(data);
      helper.response(res, "List of all users", data, 200, false);
    })
    .catch((error) => {
      console.log(error);
      helper.response(res, "User data is not found", error, 404, true);
    });
};

exports.getUserDataByID = (req, res, next) => {
  const userID = req.params.userID;

  userModel
    .getUserByID(userID)
    .then((data) => {
      console.log(data);
      helper.response(res, `User profile with id: ${userID}`, data, 200, false);
    })
    .catch((error) => {
      console.log(error);
      helper.response(res, "User data is not found", error, 404, true);
    });
};

exports.patchUserProfileImage = (req, res, next) => {
  const userID = req.params.userID;
  const newProfileImage = req.file.path;
  const updatedAt = moment(new Date(Date.now())).format("DD-MM-YYYY, HH:mm:ss");

  userModel
    .getUserByID(userID)
    .then((data) => {
      const getUserData = data[0];
      // if (!req.file) {
      //   helper.response(res, "Please upload a image file!", null, 404, true);
      // } else {
      userModel
        .updateUserAccount(newProfileImage, userID)
        .then((data) => {
          fs.unlink(getUserData.profileImage, (err) => {
            console.log(err);
          });
          helper.response(res, "Profile user is updated", data, 200, false);
        })
        .catch((error) => {
          console.log(error);
          helper.response(res, "Something went wrong", error, 400, true);
        });
      // }
    })
    .catch((error) => {
      console.log(error);
      helper.response(res, "Something went wrong", error, 400, true);
    });
};

exports.patchEditUserAccount = (req, res, next) => {
  const userID = req.params.userID;
  const fullname = req.body.fullname;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const updatedAt = moment(new Date(Date.now())).format("DD-MM-YYYY, HH:mm:ss");
  const updateData = {
    fullname: fullname,
    email: email,
    phoneNumber: phoneNumber,
    updatedAt: updatedAt,
  };

  userModel
    .updateUserAccount(updateData, userID)
    .then((data) => {
      fs.unlink(getUserData.profileImage, (err) => {
        console.log(err);
      });
      helper.response(
        res,
        "Update user account is successful",
        data,
        200,
        false
      );
    })
    .catch((error) => {
      console.log(error);
      helper.response(res, "Something went wrong", error, 400, true);
    });
};

exports.patchUserPIN = (req, res, next) => {
  const userID = req.params.userID;
  const pinNumber = Number(req.body.pinNumber);
  userModel
    .updateUserPIN(pinNumber, userID)
    .then((data) => {
      helper.response(res, "PIN Updated", data, 200, false);
    })
    .catch((error) => {
      console.log(error);
      helper.response(res, "Something wrong", error, 400, true);
    });
};

exports.deleteUserAccount = (req, res, next) => {
  const userID = req.params.userID;
  userModel
    .getUserByID(userID)
    .then((data) => {
      // console.log(data[0])
      const getUserData = data[0];
      userModel
        .deleteUserAccount(userID)
        .then((result) => {
          // console.log(getData)
          if (result.affectedRows === 0) {
            console.log(`User with id: ${userID} is not found`);
            helper.response(
              res,
              `User with id: ${userID} is not found`,
              ["data is not found"],
              404,
              true
            );
          } else {
            console.log(`User with ${userID} has been deleted`);
            fs.unlink(getUserData.profileImage, (err) => {
              console.log(err);
            });
            helper.response(
              res,
              `Book with id: ${userID} has been deleted`,
              getUserData,
              200,
              false
            );
          }
        })
        .catch((error) => {
          // console.log(error);
          helper.response(res, "Something wrong", error, 400, true);
        });
    })
    .catch((error) => {
      helper.response(res, "Something wrong", error, 400, true);
    });
};
