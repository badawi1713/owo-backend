require("dotenv").config();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((error) => {
  if (!error) {
    console.log("MySQL Database connection is established");
  } else {
    console.log(error);
    console.log("MySQL Database connection is not established");
  }
});

module.exports = connection;
