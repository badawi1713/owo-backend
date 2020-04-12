const connection = require("../config/dbConnection");

module.exports = {
  register: (data) => {
    return new Promise((resolve, reject) => {
      connection.query("INSERT INTO users SET ?", [data], (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      });
    });
  },
  updateQRCode: (qrImage, userID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET qrImage = ? WHERE userID = ?`,
        [qrImage, userID],
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
  getAllUser: () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM users`, (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      });
    });
  },
  getUserByID: (userID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE userID = ?`,
        [userID],
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
  getUserBalanceByID: (userID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT balance FROM users WHERE userID = ?`,
        [userID],
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
  getUserByPhoneNumber: (phoneNumber) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM users WHERE phoneNumber = ?`,
        [phoneNumber],
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
  getReceiverUserBalance: (receiverUserID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT balance FROM users WHERE userID = ?`,
        [receiverUserID],
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
  getSenderUserBalance: (senderUserID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT balance FROM users WHERE userID = ?`,
        [senderUserID],
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
  updateReceiverBalance: (receiverBalance, receiverUserID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET balance = ? WHERE userID = ?`,
        [receiverBalance, receiverUserID],
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
  updateSenderBalance: (senderBalance, senderUserID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET balance = ? WHERE userID = ?`,
        [senderBalance, senderUserID],
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
  updateUserAccount: (newData, userID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET ? WHERE userID = ?`,
        [newData, userID],
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
  updateUserAccountProfileImage: (profileImageUpdate, userID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET ? WHERE userID = ?`,
        [profileImageUpdate, userID],
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
  updateUserPIN: (newPIN, userID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET pinNumber = ? WHERE userID = ?`,
        [newPIN, userID],
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
  topUpUserBalance: (balanceAmount, userID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE users SET balance = ? WHERE userID = ?`,
        [balanceAmount, userID],
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
  deleteUserAccount: (userID) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM users WHERE userID = ?`,
        [userID],
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
