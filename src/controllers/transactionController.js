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
  const transactionMessage = req.body.transactionMessage;
  const transactionDate = moment(new Date(Date.now())).format("DD-MM-YYYY");
  const transactionTime = moment(new Date(Date.now())).format("HH:mm:ss");

  const transactionData = {
    senderID: senderID,
    receiverID: receiverID,
    senderPhoneNumber: senderPhoneNumber,
    receiverPhoneNumber: receiverPhoneNumber,
    transactionAmount: transactionAmount,
    transactionMessage: transactionMessage,
    transactionDate: transactionDate,
    transactionTime: transactionTime,
  };
  if (senderID === receiverID || senderPhoneNumber === receiverPhoneNumber) {
    helper.response(res, "You cannot do that!", null, 400, true);
  } else {
    userModel.getSenderUserBalance(senderID).then((data) => {
      if (data.length < 1) {
        helper.response(res, "Sender not found", null, 404, true);
      } else {
        const senderBalance = data[0].balance;

        if (senderBalance < transactionAmount || transactionAmount < 10000) {
          helper.response(
            res,
            "Your balance is not enough to transfer",
            null,
            400,
            true
          );
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
              helper.response(res, "Something went wrong", error, 400, true);
            });
        }
      }
    });
  }
};

exports.updateUserBalance = (req, res, next) => {
  const userID = req.params.userID;
  const topUpBalance = Number(req.body.balance);

  userModel
    .getUserByID(userID)
    .then((data) => {
      if (data.length < 1) {
        helper.response(res, "User data is not found", null, 404, true);
      } else {
        if (topUpBalance < 20000) {
          helper.response(
            res,
            "Top up minimum amount is Rp 20000",
            null,
            400,
            true
          );
        } else {
          const userBalance = data[0].balance + topUpBalance;
          userModel
            .topUpUserBalance(userBalance, userID)
            .then((data) => {
              // console.log("Top up is successfully added to your account");
              helper.response(
                res,
                `Top up is successfully added for user with id: ${userID}`,
                data,
                200,
                true
              );
            })
            .catch((error) => {
              console.log(error);
              helper.response(res, "Something went wrong", error, 400, true);
            });
        }
      }
    })
    .catch((error) => {
      console.log(error);
      helper.response(res, "Data is not found", error, 404, true);
    });
};
