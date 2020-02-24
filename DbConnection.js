const mysql = require('mysql');
require("dotenv").config();
const con = mysql.createConnection({
  host: "localhost",
  user: "shuny",
  password: "shun@DBGur34567",
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
module.exports = con;