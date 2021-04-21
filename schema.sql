DROP DATABASE IF EXISTS companyDB;
CREATE database companyDB;

USE companyDB;

CREATE TABLE department (
  id INT AUTO_INCREMENT,
  dept_name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT,
  title VARCHAR (30),
  salary DECIMAL (10,2),
  department_id INT,
  PRIMARY KEY (id) 
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT,
  first_name VARCHAR (30),
  last_name VARCHAR (30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id)
);