require("dotenv").config();
const userModel = require("../models/userModel");
const helper = require("../helpers/response");
const fs = require("fs");
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

exports.register = (req, res, next) => {
  const registeredAt = moment(new Date(Date.now())).format(
    "DD-MM-YYYY, HH:mm:ss"
  );
  const data = {
    fullname: req.body.fullname,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    registeredAt: registeredAt,
  };
  console.log("Phone number", data.phoneNumber);
  userModel
    .getAllUser()
    .then((result) => {
      userModel
        .register(data)
        .then((data) => {
          helper.response(
            res,
            "New user has been registered",
            data,
            201,
            false
          );
          console.log("New user has been registered");
        })
        .catch((error) => {
          console.log(error);
          helper.response(res, "Email has been registered", error, 409, true);
        });
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
  const profileImage = req.file.path;
  const updatedAt = moment(new Date(Date.now())).format("DD-MM-YYYY, HH:mm:ss");
  const updateData = {
    fullname: fullname,
    email: email,
    phoneNumber: phoneNumber,
    profileImage: profileImage,
    updatedAt: updatedAt,
  };
  // console.log("image", profileImage);
  userModel
    .getUserByID(userID)
    .then((data) => {
      const getUserData = data[0];
      if (!req.file) {
        helper.response(res, "Please upload a image file!", null, 404, true);
      } else {
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
      }
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
