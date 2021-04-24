const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const pwd = require("./pwd");
// const {
//   viewAllEmp,
//   viewAllEmpByDept,
//   viewAllEmpByRoles,
// } = require("./main/view");

//create the connection information for the sql database
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
    `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, CONCAT(m.first_name,' ',m.last_name) AS manager FROM employees
    JOIN department USING (id)
    LEFT JOIN roles ON employees.role_id = roles.id
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
    "SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS full_name, roles.title AS role FROM employees LEFT JOIN roles ON employees.role_id = roles.id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      res.forEach((employee) => {
        empList.push(employee.full_name);
      });

      connection.query(
        "SELECT employees.role_id, roles.title FROM roles JOIN employees USING (id)",
        (err, res) => {
          if (err) throw err;
          // console.log(res);
          res.forEach(({ role_id, title }, i) => {
            i++;
            roleList.push(`${role_id} ${title}`);
          });
        }
      );

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
          //console.log(answers.empChoice);
          let lastName = answers.empChoice.split(" ")[1];
          console.log(lastName);
          let updatedRole;
          roleList.filter((rle) => {
            if (rle === answers.role) {
              updatedRole = rle.split(" ")[0];
              return updatedRole;
            }
          });
          connection.query(
            "UPDATE employees SET ? WHERE ?",
            [
              {
                role_id: updatedRole,
              },
              {
                last_name: lastName,
              },
            ],
            (err, res) => {
              if (err) throw err;
              console.log(`${answers.empChoice} was successfully updated`);
              start();
            }
          );
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
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDept",
        message: "Please enter the department you'd like to add",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          dept_name: answer.newDept,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${answer.newDept} was successfully added`);
          start();
        }
      );
    });
};

const addEmp = () => {
  let mgrQuery = "SELECT * FROM employees";
  const mgrList = [];
  connection.query(mgrQuery, (err, res) => {
    if (err) throw err;
    res.forEach(({ id, first_name, last_name }, i) => {
      i++;
      mgrList.push(`${id} ${first_name} ${last_name}`);
    });
    let roleQuery =
      "SELECT employees.role_id, roles.title FROM roles JOIN employees USING (id)";
    const allRoles = [];
    connection.query(roleQuery, (err, res) => {
      if (err) throw err;
      // console.log(res);
      res.forEach(({ role_id, title }, i) => {
        i++;
        allRoles.push(`${role_id} ${title}`);
      });
    });

    inquirer
      .prompt([
        {
          type: "input",
          name: "empFirstName",
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "empLastName",
          message: "What is the employee's last name?",
        },
        {
          type: "list",
          name: "empRole",
          message: "What is the employee's role?",
          choices: allRoles,
        },
        {
          type: "list",
          name: "empMgr",
          message: "Who is the employee's manager?",
          choices: mgrList,
        },
      ])
      .then((answers) => {
        let newEmpID;
        mgrList.filter((emp) => {
          if (emp === answers.empMgr) {
            newEmpID = emp.split(" ")[0];
            return newEmpID;
          }
        });
        // console.log("Line 262", newEmpID);
        let newEmpRole;
        allRoles.filter((rle) => {
          if (rle === answers.empRole) {
            newEmpRole = rle.split(" ")[0];
            return newEmpRole;
          }
        });
        console.log(newEmpRole);
        connection.query(
          "INSERT INTO employees SET ?",
          {
            first_name: answers.empFirstName,
            last_name: answers.empLastName,
            role_id: newEmpRole,
            manager_id: newEmpID,
          },
          (err, res) => {
            if (err) throw err;
            console.log(
              `${answers.empFirstName} ${answers.empLastName} was successfully added`
            );
            start();
          }
        );
      });
  });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  start();
});
