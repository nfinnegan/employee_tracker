USE companyDB;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Natalie","Finnegan", 4, null), ("Amanda", "Wade", 3, null), ("Pat", "Gale", 2, 2), ("Scott",'Czarnik', 1, 2);

INSERT INTO department (dept_name)
VALUES ("Sales"), ("Engineering"), ("Product"), ("Finance"), ("Operations");

INSERT INTO roles (title, salary, department_id)
VALUES ("Account Manager", 90000, 1), ("Software Developer", 120000, 2), ("Product Manager", 100000, 3), ("Accountant", 110000, 4), ("Customer Success", 95000, 5);