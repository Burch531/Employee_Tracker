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
