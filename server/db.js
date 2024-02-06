const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DBHOSTNAME,
  user: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
});

module.exports = db;
