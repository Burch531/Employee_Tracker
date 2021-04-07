const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3000,
  user: "root",
  password: "JRobert202",
  database: "employee_trackerDB"
});

connection.connect(function (err) {
  if (err) throw err
  console.log("Connected as Id" + connection.threadId)
  startPrompt();
});

function startPrompt() {
  inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "choice",
      choices: [
        "View All Employees?",
        "View All Employee's By Roles?",
        "View all Emplyees By Deparments",
        "Update Employee",
        "Add Employee?",
        "Add Role?",
        "Add Department?"
      ]
    }
  ]).then(function (val) {
    switch (val.choice) {
      case "View All Employees?":
        viewEmployees();
        break;

      case "View All Employee's By Roles?":
        viewRoles();
        break;

      case "View all Emplyees By Deparments":
        viewDepartments();
        break;

      case "Add Employee?":
        addEmployee();
        break;

      case "Add Role?":
        addRole();
        break;

      case "Add Department?":
        addDepartment();
        break;

    }
  })
}

function viewEmployees() {
  connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function (err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
    })
}

function viewRoles() {
  connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
    function (err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
    })
}

function viewDepartments() {
  connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
    function (err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
    })
}

function addEmployee() {
  inquirer.prompt([
    {
      name: "firstname",
      type: "input",
      message: "Enter their first name "
    },
    {
      name: "lastname",
      type: "input",
      message: "Enter their last name "
    },
    {
      name: "role",
      type: "list",
      message: "What is their role? ",
      choices: selectRole()
    },
    {
      name: "choice",
      type: "rawlist",
      message: "Whats their managers name?",
      choices: selectManager()
    }
  ]).then(function (val) {
    var roleId = selectRole().indexOf(val.role) + 1
    var managerId = selectManager().indexOf(val.choice) + 1
    connection.query("INSERT INTO employee SET ?",
      {
        first_name: val.firstName,
        last_name: val.lastName,
        manager_id: managerId,
        role_id: roleId

      }, function (err) {
        if (err) throw err
        console.table(val)
        startPrompt()
      })

  })
}

