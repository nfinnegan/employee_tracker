const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const pwd = require("./pwd");

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
          "Update Employee Role",
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
        case "View All Roles":
          viewAllRoles();
          break;
        case "Update Employee Role":
          updateRole();
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
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.dept_name, roles.salary FROM employees JOIN department USING (id) JOIN roles USING (id)",
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
    "SELECT employees.id, employees.first_name, employees.last_name, department.dept_name FROM employees JOIN department USING (id)",
    (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      start();
    }
  );
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  start();
});
