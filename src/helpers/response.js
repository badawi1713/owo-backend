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
};
