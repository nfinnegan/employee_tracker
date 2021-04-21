const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
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
          "View All Departments",
          "View All Roles",
          "Update Employee Role",
          "Add Role",
          "Add Department",
          "Add Employee",
        ],
      },
    ])
    .then((answers) => {
      console.log(answers);
      if (answers.queryType === "Find song by artist") {
        getArtist();
      } else if (
        answers.queryType === "Find artist who appears more than once"
      ) {
        dupArtist();
      } else if (answers.queryType === "Find data between an existing range") {
        inBetween();
      } else if (answers.queryType === "Search for specific song") {
        searchSong();
      } else {
        return;
      }
    });
};

const getArtist = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "artist",
        message: "What artist would you like to search?",
      },
    ])
    .then((data) => {
      console.log(data);
      connection.query(
        "SELECT * FROM Top5000 WHERE ?",
        {
          artist: data.artist,
        },
        (err, res) => {
          if (err) throw err;
          // Log all results of the SELECT statement
          console.log(res);
          //connection.end();
        }
      );
    });
};
//console.log("Selecting all songs by artist\n");

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  //  start();
});

//   .then((answer) => {
//     switch (answer.action) {
//       case 'Find songs by artist':
//         artistSearch();
//         break;

//       case 'Find all artists who appear more than once':
//         multiSearch();
//         break;

//       case 'Find data within a specific range':
//         rangeSearch();
//         break;

//       case 'Search for a specific song':
//         songSearch();
//         break;

//       case 'Exit':
//         connection.end();
//         break;

//       default:
//         console.log(`Invalid action: ${answer.action}`);
//         break;
//     }
//   });
