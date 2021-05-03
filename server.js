const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "JRobert202",
  database: "employee_trackerdb"
});

connection.connect(function (err) {
  if (err) throw err
  console.log("Connected as Id" + connection.threadId)
});

start();

function start() {
    inquirer.prompt({
        type: "rawlist",
        message: "What would you like to do today?",
        name: "choice",
        choices: [
            "View all employees.",
            "View all departments.",
            "View all roles.",
            "View all employees by department.",
            "Add employee.",
            "Add a new role.",
            "Add a new department.",
            "Remove employee.",
            "Remove role.",
            "Remove department.",
            "Update employee role.",
            "Exit"
        ]
    }).then(answer => {
        switch (answer.choice) {
            case "View all employees.":
                viewEmployees();
                break;
            case "View all departments.":
                viewDept();
                break;
            case "View all roles.":
                emplyoeeRole();
                break;
            case "View all employees by department.":
                employeeDept();
                break;
            case "Add employee.":
                addEmployee();
                break;
            case "Add a new role.":
                addRole();
                break;
            case "Add a new department.":
                addDept();
                break;
            case "Remove employee.":
                removeEmployee();
                break;
            case "Remove role.":
                deleteRole();
                break;
            case "Remove department.":
                deleteDept();
                break;
            case "Update employee role.":
                updateRole();
                break;
            default:
                connection.end();
        };
    })
}

function viewEmployees() {
    let query = connection.query(
        `SELECT employee.id 'EMPLOYEE ID', employee.first_name 'FIRST NAME', employee.last_name 'LAST NAME', department.name 'DEPARTMENT', role.title 'TITLE', role.salary 'SALARY' 
        FROM employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department on role.department_id = department.id;`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            "\n";
            start();
        })
}

function viewDept() {
    let query = connection.query("SELECT id 'DEPT ID', name 'DEPT NAME' FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        "\n";
        start();
    })
}

function emplyoeeRole() {
    let query = connection.query("SELECT title 'TITLE', salary 'SALARY' FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        "\n";
        start();
    })
}

function employeeDept() {
    connection.query("SELECT * FROM department",
        function (err, res) {
            if (err) throw err;

            inquirer.prompt([
                {
                    type: "list",
                    message: "Which department would you like to view?",
                    name: "dept",
                    choices: res.map(res => res.id + " " + res.name)
                }
            ]).then(answer => {
                let deptName = answer.dept.split(" ")[1];

                let query = connection.query(
                    `SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Department' 
                    FROM employee 
                    LEFT JOIN role ON employee.role_id = role.id
                    LEFT JOIN department ON role.department_id = department.id
                    WHERE department.name = ?`,
                    [deptName],
                    (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        "\n";
                        start();
                    })
            })
        })
}

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName"
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName"
        }
    ]).then(answer => {
        let query = connection.query("INSERT INTO employee SET ?",
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: null,
                manager_id: null
            },
            function (err, res) {
                if (err) throw err;
            }
        );
        console.log(answer.firstName + " has been added!")
        "\n"

        start();
    })
};

function addRole() {
    connection.query("SELECT * FROM department",
        function (err, res) {
            if (err) throw err;

            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the title of the new role?",
                    name: "title"
                },
                {
                    type: "input",
                    message: "What is the salary for the role? (123456.00)?",
                    name: "salary"
                },
                {
                    type: "list",
                    message: "What is the department ID for this role?",
                    name: "deptID",
                    choices: res.map(res => res.id + " " + res.name)
                }
            ]).then(answer => {
                deptId = answer.deptID.split(' ')[0];

                let query = connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: deptId
                    },
                    function (err, res) {
                        if (err) throw err;
                    }
                );
                console.log("The role " + answer.title + " has been added!")
                "\n"

                start();
            })
        })
};

function addDept() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department you'd like to add?",
            name: "name"
        }
    ]).then(answer => {
        let query = connection.query(
            "INSERT INTO department SET ?",
            {
                name: answer.name
            },
            (err, res) => {
                if (err) throw err;
            }
        );
        console.log("The department " + answer.name + " has been added!")
        "\n"

        start();
    })
};

function removeEmployee() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "list",
                message: "Which employee's would you like to remove?",
                name: "removeEmployee",
                choices: res.map(res => res.id + " " + res.first_name + " " + res.last_name)
            }
        ]).then(answer => {
            empRem = answer.removeEmployee.split(" ")[0];
            empName = answer.removeEmployee.split(" ")[1];

            connection.query("DELETE FROM employee WHERE employee.id = ?",
                [empRem],
                (err, res) => {
                    if (err) throw err;
                }
            );
            console.log(empName + " has been removed!")
            "\n"

            start();
        })
    })
}

function deleteRole() {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "list",
                message: "Which role would you like to remove?",
                name: "deleteRole",
                choices: res.map(res => res.id + " " + res.title)
            }
        ]).then(answer => {
            roleRem = answer.deleteRole.split(" ")[0];
            roleName = answer.deleteRole.split(" ")[1];

            connection.query("DELETE FROM role WHERE role.id = ?",
                [roleRem],
                (err, res) => {
                    if (err) throw err;
                }
            );
            console.log("The role has been removed!")
            "\n"

            start();
        })
    })
}

function deleteDept() {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "list",
                message: "Which department would you like to remove?",
                name: "deleteDept",
                choices: res.map(res => res.name)
            }
        ]).then(answer => {
            deptRem = answer.deleteDept;

            connection.query("DELETE FROM department WHERE name = ?",
                [deptRem],
                (err, res) => {
                    if (err) throw err;
                }
            );
            console.log("The dpartment " + deptRem + " has been removed!")
            "\n"

            start();
        })
    })
}

function updateRole() {
    let query = connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Which employee's role would you like to update?",
                name: "whichemp",
                choices: res.map(res => res.id + " " + res.first_name + " " + res.last_name)
            }
        ]).then(employee => {
            let empId = employee.whichemp.split(' ')[0];

            let query = connection.query("SELECT * FROM role", (err, res) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: "list",
                        message: "What is the employee's new role?",
                        name: "newrole",
                        choices: res.map(res => res.id + " " + res.title)
                    }
                ]).then(newrole => {
                    let roleId = newrole.newrole.split(' ')[0];

                    let query = connection.query("UPDATE employee SET role_id = ? WHERE id = ?",
                        [roleId, empId],
                        (err, res) => {
                            if (err) throw err;
                        }
                    );
                    start();
                });
            });
        });
    });

}
