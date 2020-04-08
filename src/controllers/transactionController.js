require("dotenv").config();
const transactionModel = require("../models/transactionModel");
const historyModel = require("../models/historyModel");
const userModel = require("../models/userModel");
const helper = require("../helpers/response");

const moment = require("moment");

exports.postNewTransaction = (req, res, next) => {
  const senderID = req.body.senderID;
  const receiverID = req.body.receiverID;
  const senderPhoneNumber = req.body.senderPhoneNumber;
  const receiverPhoneNumber = req.body.receiverPhoneNumber;
  const transactionAmount = Number(req.body.transactionAmount);
  const transactionDate = moment(new Date(Date.now())).format("DD-MM-YYYY");
  const transactionTime = moment(new Date(Date.now())).format("HH:mm:ss");

  const transactionData = {
    senderID: senderID,
    receiverID: receiverID,
    senderPhoneNumber: senderPhoneNumber,
    receiverPhoneNumber: receiverPhoneNumber,
    transactionAmount: transactionAmount,
    transactionDate: transactionDate,
    transactionTime: transactionTime,
  };
  if (senderID === receiverID && senderPhoneNumber === receiverPhoneNumber) {
    helper.response(res, "You cannot do that!", [], 400, true);
  } else {
    userModel.getAllUser;
    transactionModel
      .newTransaction(transactionData)
      .then((data) => {
        let transactionData = {
          id: data.insertId,
          senderID: senderID,
          receiverID: receiverID,
          transactionAmount: transactionAmount,
          transactionDate: transactionDate,
          transactionTime: transactionTime,
        };
        helper.response(
          res,
          "Tranfer is successful",
          transactionData,
          201,
          false
        );
        let historyData = {
          transactionID: transactionData.id,
          senderID: transactionData.senderID,
          receiverID: transactionData.receiverID,
          transactionAmount: transactionData.transactionAmount,
          transactionDate: transactionData.transactionDate,
          transactionTime: transactionData.transactionTime,
        };
        historyModel
          .insertNewTransactionHistory(historyData)
          .then((data) => {
            console.log("Transaction data is recorded");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .then(() => {
        userModel
          .getSenderUserBalance(senderID)
          .then((data) => {
            const senderBalance = data[0].balance - transactionAmount;
            userModel
              .updateSenderBalance(senderBalance, senderID)
              .then((data) => {
                console.log("Sender balance Rp", senderBalance);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .then(() => {
        userModel
          .getReceiverUserBalance(receiverID)
          .then((data) => {
            const receiverBalance = data[0].balance + transactionAmount;
            userModel
              .updateReceiverBalance(receiverBalance, receiverID)
              .then((data) => {
                console.log("Receiver balance: Rp", receiverBalance);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
        helper.response(res, "Something went wrong", error, 500, true);
      });
  }
};
