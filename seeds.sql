USE companyDB;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Natalie","Finnegan", 20, 30), ("Amanda", "Wade", 21, 20), ("Pat", "Gale", 22, 31), ("Scott",'Czarnik', 23, 32);

INSERT INTO department (dept_name)
VALUES ("Sales"), ("Engineering"), ("Product"), ("Finance"), ("Operations");

INSERT INTO roles (title, salary, department_id)
VALUES ("Account Manager", 90000, 100), ("Software Developer", 120000, 200), ("Product Manager", 100000, 300), ("Accountant", 110000, 400), ("Customer Success", 95000, 500);