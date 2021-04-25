const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const pwd = require("./pwd");

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

//Starter Prompt of Options with a switch/case statement invoking the function corresponding to user input
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

//View ALL Employees
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

//View ALL Employees by Department
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

//View ALL Employees by Role
const viewAllEmpByRoles = () => {
  connection.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title AS role, roles.salary FROM employees JOIN roles ON employees.role_id = roles.id",
    (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      start();
    }
  );
};

//Updates Existing Employee
const updateEmpRole = () => {
  //declare empty array to put each employee in once the query runs to be used in the choices list for the inquirer prompt
  const empList = [];
  //declare empty array to put each role in oce the query runs to be used in the choices list for the inquirer prompt
  const roleList = [];
  connection.query(
    "SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS full_name, roles.title AS role FROM employees LEFT JOIN roles ON employees.role_id = roles.id",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      //for each element in the array, push the employee's full name, which was created as an alias (concatenated by above in the query statement)
      res.forEach((employee) => {
        empList.push(employee.full_name);
      });

      connection.query(
        "SELECT roles.id, roles.title FROM roles",
        (err, res) => {
          if (err) throw err;
          // console.log(res);
          //deconstruct the id and title of each role in the database and push it into the empty array
          res.forEach(({ id, title }, i) => {
            i++;
            roleList.push(`${id} ${title}`);
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
          //split off the last name from the empList using split on the 1st index, so we can make sure we are updating the role to the
          //correct corresponding employee, vs the entire employee list
          let lastName = answers.empChoice.split(" ")[1];

          let updatedRole;
          //filter through each element in the role list array, if the it matches the user input execute the code block in the if statement
          roleList.filter((rle) => {
            if (rle === answers.role) {
              //split off the role ID that was pushed into the roleList array so that we can update the employee,
              //using their last name, to their new updated role
              updatedRole = rle.split(" ")[0];
              return updatedRole;
            }
          });
          //updating employee role in the database
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

//add a New Role
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

//adding new department
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

//adding new employee
const addEmp = () => {
  let mgrQuery = "SELECT * FROM employees";
  //empty array declared to put every employee/id into once query is run
  const mgrList = [];
  connection.query(mgrQuery, (err, res) => {
    if (err) throw err;

    //for each element in the mgrQuery, take id, first and last name and push it into the empty mgrList
    //array to be used in the choices in the inquirer prompt
    res.forEach(({ id, first_name, last_name }, i) => {
      i++;
      mgrList.push(`${id} ${first_name} ${last_name}`);
    });
    let roleQuery = "SELECT roles.id, roles.title FROM roles";
    //empty array declared to put all roles into from database roleQuery
    const allRoles = [];
    connection.query(roleQuery, (err, res) => {
      if (err) throw err;
      //for each element in roleQuery, take id & title and push it into the empty allRoles array
      //to be displayed in choices for inquirer prompt
      res.forEach(({ id, title }, i) => {
        i++;
        allRoles.push(`${id} ${title}`);
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
        //filter through the array and find the element that matches user input, split off the ID number
        //to ensure we get the ID number of that employee and input it into the managers ID column in the DB
        mgrList.filter((emp) => {
          if (emp === answers.empMgr) {
            newEmpID = emp.split(" ")[0];
            return newEmpID;
          }
        });
        // console.log("Line 262", newEmpID);
        let newEmpRole;
        //filter through allRoles array to find element that matches user input, split off the ID number to ensure we are adding the right role id to the DB
        allRoles.filter((rle) => {
          if (rle === answers.empRole) {
            newEmpRole = rle.split(" ")[0];
            return newEmpRole;
          }
        });
        //console.log(newEmpRole);
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

//Initialize App
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  start();
});
