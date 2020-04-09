const crypto = require("crypto");

module.exports = {
  response: (res, message, result, status, error) => {
    let resultPrint = {};
    resultPrint.error = error || false;
    resultPrint.status = status || 200;
    resultPrint.result = result || [];
    resultPrint.message = message || null;
    return res.status(resultPrint.status).json(resultPrint);
  },
  getRandomSalt: (length) => {
    return crypto
      .randomBytes(Math.ceil(length * 4))
      .toString("hex")
      .slice(0, length); //generate PIN salt
  },
  setPIN: (pinNumber, salt) => {
    let hashPIN = crypto.createHmac("sha256", salt);
    hashPIN.update(pinNumber);
    let value = hashPIN.digest("hex");
    return {
      salt: salt,
      pinHash: value,
    };
  },
};
