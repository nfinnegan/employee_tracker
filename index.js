const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const pwd = require("./pwd");
// const {
//   viewAllEmp,
//   viewAllEmpByDept,
//   viewAllEmpByRoles,
// } = require("./main/view");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: pwd,
  database: "companyDB",
});

const start = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "queryType",
        choices: [
          "View All Employees",
          "View All Employees by Department",
          "View All Employees by Role",
          "Update Employee's Role",
          "Add Role",
          "Add Department",
          "Add Employee",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      console.log(answers);
      switch (answers.queryType) {
        case "View All Employees":
          viewAllEmp();
          break;
        case "View All Employees by Department":
          viewAllEmpByDept();
          break;
        case "View All Employees by Role":
          viewAllEmpByRoles();
          break;
        case "Update Employee's Role":
          updateEmpRole();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Department":
          addDept();
          break;
        case "Add Employee":
          addEmp();
          break;
        case "Exit":
          connection.end();
          break;
        default:
          console.log(`Invalid action: ${answer.queryType}`);
          break;
      }
    });
};

const viewAllEmp = () => {
  connection.query(
    `SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.dept_name, roles.salary, CONCAT(m.first_name,' ',m.last_name) AS manager FROM employees
    JOIN department USING (id)
    JOIN roles USING (id)
    LEFT JOIN employees AS m ON employees.manager_id = m.id`,
    (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      start();
    }
  );
};

const viewAllEmpByDept = () => {
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, department.dept_name AS department FROM employees JOIN department USING (id)",
    (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      start();
    }
  );
};

const viewAllEmpByRoles = () => {
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role, roles.salary FROM employees JOIN roles USING (id)",
    (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      start();
    }
  );
};

const updateEmpRole = () => {
  const empList = [];
  const roleList = [];
  connection.query(
    "SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS full_name, roles.title AS role FROM employees JOIN roles USING (id)",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      res.forEach((employee) => {
        empList.push(employee.full_name);
      });
      res.forEach((roles) => {
        console.log(roles);
        roleList.push(roles.role);
      });

      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee needs their role updated?",
            name: "empChoice",
            choices: empList,
          },
          {
            type: "list",
            message: "Select their new role",
            name: "role",
            choices: roleList,
          },
        ])
        .then((answers) => {
          connection.query();
        });
    }
  );
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newRole",
        message: "Please enter the role you'd like to add",
      },
      {
        type: "input",
        name: "newSal",
        message: "What is the starting salary for this role?",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO roles SET ?",
        {
          title: answer.newRole,
          salary: answer.newSal,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${answer.newRole} was successfully added`);
          start();
        }
      );
    });
};

const addDept = () => {
    
}


connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  start();
});
