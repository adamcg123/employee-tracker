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
    console.log("server working");
    startup();

});

function startup() {
    inquirer
        .prompt({
            type: "list",
            choices: [
                "Add department",
                "Add role",
                "Add employee",
                "View departments",
                "View Roles",
                "View employees",
                "Update employee role",
                "Quit",
            ],
            message: "what would you like to do?",
            name: "option"
        })
}

startup();