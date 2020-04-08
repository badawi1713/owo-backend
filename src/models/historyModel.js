const connection = require("../config/dbConnection");

module.exports = {
  insertNewTransactionHistory: (transactionData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO history SET ?`,
        [transactionData],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },
  getAllTransactionHistory: (userID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM history WHERE senderID = ? OR receiverID = ?`,
        [userID, userID],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },
  getTransactionHistoryDetail: (historyID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM history WHERE historyID = ?`,
        [historyID],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    });
  },
};
