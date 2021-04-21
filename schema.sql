DROP DATABASE IF EXISTS companyDB;
CREATE database companyDB;

USE companyDB;

CREATE TABLE department (
  id INT PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE roles (
  id INT PRIMARY KEY,
  title VARCHAR (30),
  salary DECIMAL (10,2),
  department_id INT 
);

CREATE TABLE employee (
  id INT PRIMARY KEY,
  first_name VARCHAR (30),
  last_name VARCHAR (30),
  role_id INT,
  manager_id INT,
);