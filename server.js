const mysql = require("mysql");
const inquirer = require("inquirer");

const consoleTable = require("console.table");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'N1K3J0RDaN2102!',
    database: 'employee_tracker_db'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("server connected");


    //  connection.end();//
});