DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;


CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
 
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  manager_id INT,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)

);


INSERT INTO department (name)
VALUE ("Management");
INSERT INTO department (name)
VALUE ("IT");
INSERT INTO department (name)
VALUE ("Employee");
INSERT INTO department (name)
VALUE ("Sales");
INSERT INTO department (name)
VALUE ("Intern");


INSERT INTO role (title, salary, department_id)
VALUE ("Manager", 150000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Assistant", 50000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 100000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Intern", 25000, 5);
INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 80000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Database Admin", 150000, 2);



INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Harper", "Lily", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Piper", "Rose", null, 1);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Laurie","Williams",2,3);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Deb", "Fisher", 2, 5);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Chris", "Smith", 2, 4);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("RJ", "Heck", 1, 2);
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE ("Tom", "Benson", 2, 5);
