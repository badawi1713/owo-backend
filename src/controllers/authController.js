require("dotenv").config();
const helper = require("../helpers/response");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const qrcode = require("qrcode");

// const nodemailer = require("nodemailer");
// const sendGridTransport = require("nodemailer-sendgrid-transport");

// const transporter = nodemailer.createTransport(
// sendGridTransport({
// auth: {
// api_key:
// API_KEY,
// },
// })
// );

exports.register = async (req, res, next) => {
  const registeredAt = moment(new Date(Date.now())).format(
    "DD-MM-YYYY, HH:mm:ss"
  );
  const updatedAt = moment(new Date(Date.now())).format("DD-MM-YYYY, HH:mm:ss");
  const fullname = req.body.fullname;
  const email = req.body.email;
  const pinNumber = req.body.pinNumber;
  const phoneNumber = req.body.phoneNumber;
  const profileImage =
    "https://oasys.ch/wp-content/uploads/2019/03/photo-avatar-profil.png";
  const balance = 0;
  const qrImage = await qrcode.toDataURL(phoneNumber);
  const salt = helper.getRandomSalt(process.env.LENGTH_SALT);
  const pinHash = helper.setPIN(pinNumber, salt);

  const userData = {
    fullname: fullname,
    email: email,
    pinNumber: pinHash.pinHash,
    phoneNumber: phoneNumber,
    profileImage: profileImage,
    balance: balance,
    qrImage: qrImage,
    registeredAt: registeredAt,
    updatedAt: updatedAt,
    salt: pinHash.salt,
  };

  userModel
    .getAllUser()
    .then(() => {
      // console.log("user data", data);
      userModel
        .register(userData)
        .then(async (data) => {
          helper.response(res, "New user registered", data, 201, false);
        })
        .catch((error) => {
          // console.log(error);
          helper.response(res, "Email has been registered", null, 409, true);
        });
    })
    .catch((error) => {
      console.log(error);
      helper.response(res, "Something went wrong", error, 400, true);
    });
};

exports.checkUserPhoneNumber = (req, res, next) => {
  const phoneNumber = req.query.phoneNumber;
  // console.log(phoneNumber);
  userModel
    .getUserByPhoneNumber(phoneNumber)
    .then((data) => {
      const userData = data[0];
      if (data.length < 1) {
        helper.response(res, "User not found found", null, 404, true);
      } else {
        console.log(data[0]);
        helper.response(res, "User found", data, 200, false);
      }
    })
    .catch((error) => {
      helper.response(res, "Something went wrong", error, 500, true);
    });
};

exports.loginUser = (req, res, next) => {
  const phoneNumber = req.body.phoneNumber;
  const pinNumber = req.body.pinNumber;

  userModel
    .getUserByPhoneNumber(phoneNumber)
    .then((data) => {
      const userData = data[0];
      const userPIN = helper.setPIN(pinNumber, userData.salt).pinHash;

      if (userPIN === userData.pinNumber) {
        userData.token = jwt.sign(
          {
            phoneNumber: userData.phoneNumber,
            userID: userData.userID,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "3600s",
          }
        );

        delete userData.salt;
        delete userData.pinNumber;
        return helper.response(res, "Login success", userData, 200, false);
      } else {
        return helper.response(
          res,
          "Make sure your PIN is right",
          null,
          401,
          true
        );
      }
    })
    .catch((error) => {
      console.log(error);
      return helper.response(
        res,
        `Phone number is not registered. Please make sure your phone number is correct`,
        null,
        404,
        true
      );
    });
};
