const mysql = require("mysql");

const mysqlConnection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "erp",
});

mysqlConnection.connect((err) => {
  if (!err) console.log("DB connection succeded.");
  else
    console.log(
      "DB connection failed \n Error : " + JSON.stringify(err, undefined, 2)
    );
});

module.exports = mysqlConnection;

