require("dotenv").config();
const helper = require("../helpers/response");

const historyModel = require("../models/historyModel");

exports.getAllHistoryTransaction = (req, res, next) => {
  const userID = req.params.userID;
  historyModel
    .getAllTransactionHistory(userID)
    .then((data) => {
      // console.log(data);
      if (data.length < 1) {
        helper.response(res, `Transaction history is empty`, null, 404, true);
      } else {
        helper.response(
          res,
          `List of all transaction history, that associate with user ID: ${userID}`,
          data,
          200,
          false
        );
      }
    })
    .catch((error) => {
      // console.log(error);
      helper.response(res, "Something went wrong", null, 400, true);
    });
};

exports.getDetailTransactionHistory = (req, res, next) => {
  const historyID = req.params.historyID;
  historyModel
    .getTransactionHistoryDetail(historyID)
    .then((data) => {
      if (data.length < 1) {
        helper.response(
          res,
          `Transaction history data is not found`,
          null,
          404,
          true
        );
      } else {
        helper.response(
          res,
          `Transaction history with ID: ${historyID}`,
          data,
          200,
          false
        );
      }
    })
    .catch((error) => {
      console.log(error);
      helper.response(res, "Something went wrong", error, 400, true);
    });
};
