const mysql = require('mysql');
require("dotenv").config();
const con = mysql.createConnection({
  host: "192.168.0.126",
  user: "root",
  password: "password",
  database: "smart_dustbin"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
// con.end(function(err) {
//   if (err) throw err;
//   console.log("Disconnected!");
// });
module.exports = con