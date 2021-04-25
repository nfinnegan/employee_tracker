# employee_tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description 📁

This is a CLI application. Once you've cloned down the repo, use the schema.sql file to create your database. Feel free to use the seeds.sql file as well to get yourself started with dummy data, or import your own. When you have established a connection using your credentials, simply follow the installation instructions, and then type `node index.js` or `npm start` to begin. You will be prompted with a list of questions ranging from 'View All Employees' to 'Add Employee' all of which will be saved to your database for future reference. This project is the culmination of last week's sprint where we learned MySQL.

## User Story 👩

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

## Technologies Used 💻

- Node.js
- JavaScript
- mysql & inquirer npm packages

## Installation 💾

To install the necessary dependencies, please run the following (individually) in your terminal:

        npm init -y
        npm install inquirer
        npm install mysql
        npm install console.table

## Preview 🔍

Check out the applications functionality below:

* https://www.youtube.com/watch?v=h7iV33hfnOE

## Challenges/Known Issue 🔴

I had to re-work my approach a few times, when I initially created my seed file, I wasn't really taking into consideration the relational part of the tables within the database outside of the id itself, so it resulted in reconfiguring a few times. In addition, although I am able to view employees by department, the department doesn't necessarily correlate with the role, and I couldn't figure out how to accomplish that. That said, all other functionality works as expected.


## Resources 💡

My tutor, David Metcalf, helped me with a hiccup I was having with adding an employee. He suggested I include the IDs in the display which helped me make updates in the database where needed. Also, my TA, Rad Fugiel, helped me work through a query issue on updating employee so that the correct updated role displayed. In addition to the support of them, I found the below article to be helpful

- https://stackoverflow.com/questions/22739841/mysql-combine-two-columns-into-one-column/22739860


## License

This project is covered under the MIT license.
