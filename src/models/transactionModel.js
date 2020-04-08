const connection = require("../config/dbConnection");

module.exports = {
  newTransaction: (transactionData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO transactions SET ?`,
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
};
