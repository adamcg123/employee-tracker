const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table')

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'N1K3J0RDaN2102!',
    database: 'employee_tracker_db'
});

connection.connect(function (err) {
    if (err) throw err;
    startup();
})

function startup() {
    inquirer
        .prompt({
            name: "startMenu",
            type: "list",
            message: "Hello What would you like to do?",
            choices: [
                "View all employees",
                "View all departments",
                "View all roles",
                "Add an employee",
                "Add a department",
                "Add a role",
                "Update employee role",
                "Delete an employee",
                "exit"
            ]
        }).then(function (answer) {
            switch (answer.startMenu) {
                case 'View all employees':
                    viewEmployees();
                    break
                case 'View all departments':
                    viewDepartments();
                    break
                case 'View all roles':
                    viewRoles();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break
                case 'Add a department':
                    addDepartment();
                    break
                case 'Add a role':
                    addRole();
                    break
                case 'Update employee role':
                    updateRole();
                    break
                case 'Delete an employee':
                    deleteEmployee();
                    break
                case 'EXIT':
                    exitApp();
                    break
                default:
                    break;
            }
        })
};

function viewEmployees() {
    var query = 'SELECT * FROM employee';
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log(res.length + ' employees found total');
        console.table('All Employees:', res);
        startup();
    })
};

function viewDepartments() {
    var query = 'SELECT * FROM department';
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        startup();
    })
};

function viewRoles() {
    var query = 'SELECT * FROM role';
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        startup();
    })
};

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'fistName',
            message: "What is the employee's first name?",
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const params = [answer.fistName, answer.lastName]

            const roleSql = `SELECT role.id, role.title FROM role`;

            connection.query(roleSql, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        params.push(role);

                        const managerSql = `SELECT * FROM employee`;

                        connection.query(managerSql, (err, data) => {
                            if (err) throw err;

                            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                            const noManager = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee's manager?",
                                    choices: managers, noManager

                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    params.push(manager);

                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`
                                    connection.query(sql, params, (err, data) => {
                                        if (err) throw err;
                                        console.log("Employee has been added!")

                                        viewEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};

function addDepartment() {
    inquirer
        .prompt([
            {
                name: 'newDepartment',
                type: 'input',
                message: 'What is the name of the department?'
            }
        ]).then(function (answer) {
            connection.query(
                'INSERT INTO department SET ?',
                {
                    name: answer.newDepartment
                });
            var query = 'SELECT * FROM department';
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log('Department has been added!');
                console.table('All Departments:', res);
                startup();
            })
        })
};

function addRole() {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: 'new_role',
                    type: 'input',
                    message: "What is the name of the role?"
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary of this role?'
                },
                {
                    message: 'Which department does this role belong to?',
                    name: 'Department',
                    type: 'list',
                    choices: function () {
                        var deptArry = [];
                        for (let i = 0; i < res.length; i++) {
                            deptArry.push(res[i].name);
                        }
                        return deptArry;
                    },
                }
            ]).then(function (answer) {
                let department_id;
                for (let a = 0; a < res.length; a++) {
                    if (res[a].name == answer.Department) {
                        department_id = res[a].id;
                    }
                }

                connection.query(
                    'INSERT INTO role SET ?',
                    {
                        title: answer.new_role,
                        salary: answer.salary,
                        department_id: department_id
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log('Your new role has been added!');
                        console.table('All Roles:', res);
                        startup();
                    })
            })
    })
};

// update a role in the database
function updateRole() {

};

//  delete an employee
function deleteEmployee() {

};

function exitApp() {
    connection.end();
};