const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "131452",
  database: "employee_db",
});

async function init() {
    try {
        const answers = await inquirer.prompt([{
            name: "initialQuestion",
            type: "list",
            message: "What do you want to do?",
            choices: [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee role",
                "EXIT",
            ],
        }]);

        switch (answers.initialQuestion) {
            case "view all departments":
                viewAllDepartments();
                break;
            case "view all roles":
                viewAllRoles();
                break;
            case "view all employees":
                viewAllEmployees();
                break;
            case "add a department":
                addDepartment();
                break;
            case "add a role":
                addRole();
                break;
            case "add an employee":
                addEmployee();
                break;
            case "update an employee role":
                updateEmployeeRole();
                break;
            case "EXIT":
                db.end();
                break;
            default:
                break;
        }
    } catch (err) {
        console.log(err);
    }
}


init();
function viewAllDepartments() {
    // In case of viewing all the department, 
    // console table all the information related to departments.
    db.query('SELECT * FROM department', (err,results)=>{
        if(err){
            console.log("Error fetching all the departments");
            return;
        }
        console.table(results);
        init();

    })
}

function viewAllRoles() {
    //In case of viewing all the roles,
    //console table all the information related to roles,
    db.query('SELECT * FROM role', (err,results)=>{
        if(err){
            console.log('Error fetching all the roles');
            return;
        }
        console.table(results);
        init();
    })
}

function viewAllEmployees() {
    //In case of viewing all the employees,
    //console table all the information related to employees,
    db.query('SELECT * FROM employee', (err,results)=>{
        if(err){
            console.log('Error fetching all the employees')
            return;
        }
        console.table(results);
        init();
    })
}

function addDepartment() {
    //In case of adding a deparment,
    //let the user enter the name of the new department,
    //console table all the departments
    inquirer
        .prompt({
            name:"deptName",
            type: "input",
            message: "Enter the name of the department"
        })
        .then((answer) => {
            db.query("INSERT INTO department(name) VALUES (?)", [answer.deptName],(err,results)=>{
                if(err){
                    console.log("Error adding department");
                }else{
                    console.log("Department added successfully.");
                }
                init();
            })
        })
}

function addRole() {
    //In case of adding roles,
    //let the user 
    db.query("SELECT * FROM department", (err,departments)=>{
        if(err){
            console.log('Error fetching departments for adding roles')
            return;
        }   

        inquirer
            .prompt([
                {
                    name:"roleTitle",
                    type:"input",
                    message: "Enter the title of the role:"
                },
                {
                    name:"roleSalary",
                    type:"input",
                    message:'Enter the salary for the role:'
                },
                {
                    name:"departmentChoice",
                    type:"list",
                    message: "Select the department for the roles:",
                    choices:departments.map((department)=>({
                        name:department.name,
                        value:department.id
                    }))
                }
            ])
            .then((answers)=>{
                db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
                [answers.roleTitle, answers.roleSalary, answers.departmentChoice],
                (err,results)=>{
                    if(err){
                        console.log("Error adding roles");
                        return;
                    }else{
                        console.log("Role added successfully");
        
                    }
                    init();
                })
            })
    })
}

function addEmployee() {
    db.query("SELECT * FROM role", (err, roles) => {
        if (err) {
          console.error("Error fetching roles: " + err.message);
          return;
        }
    
        // Get employees for displaying as choices in inquirer prompt
        db.query("SELECT * FROM employee", (err, employees) => {
          if (err) {
            console.error("Error fetching employees: " + err.message);
            return;
          }
    
          inquirer
            .prompt([
              {
                name: "firstName",
                type: "input",
                message: "Enter the employee's first name:",
              },
              {
                name: "lastName",
                type: "input",
                message: "Enter the employee's last name:",
              },
              {
                name: "roleChoice",
                type: "list",
                message: "Select the employee's role:",
                choices: roles.map((role) => ({
                  name: role.title,
                  value: role.id,
                })),
              },
              {
                name: "managerChoice",
                type: "list",
                message: "Select the employee's manager:",
                choices: employees.map((employee) => ({
                  name: `${employee.first_name} ${employee.last_name}`,
                  value: employee.id,
                })),
              },
            ])
            .then((answers) => {
              db.query(
                "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
                [
                  answers.firstName,
                  answers.lastName,
                  answers.roleChoice,
                  answers.managerChoice,
                ],
                (err, result) => {
                  if (err) {
                    console.error("Error adding employee: " + err.message);
                  } else {
                    console.log("Employee added successfully.");
                  }
                  init();
                }
              );
            });
        });
      });
    }


function updateEmployeeRole() {
    db.query("SELECT * FROM employee", (err, employees) => {
        if (err) {
          console.error("Error fetching employees: " + err.message);
          return;
        }
    
        // Get roles for displaying as choices in inquirer prompt
        db.query("SELECT * FROM role", (err, roles) => {
          if (err) {
            console.error("Error fetching roles: " + err.message);
            return;
          }
    
          inquirer
            .prompt([
              {
                name: "employeeChoice",
                type: "list",
                message: "Select the employee to update:",
                choices: employees.map((employee) => ({
                  name: `${employee.first_name} ${employee.last_name}`,
                  value: employee.id,
                })),
              },
              {
                name: "newRoleChoice",
                type: "list",
                message: "Select the new role for the employee:",
                choices: roles.map((role) => ({
                  name: role.title,
                  value: role.id,
                })),
              },
            ])
            .then((answers) => {
              db.query(
                "UPDATE employee SET role_id = ? WHERE id = ?",
                [answers.newRoleChoice, answers.employeeChoice],
                (err, result) => {
                  if (err) {
                    console.error("Error updating employee role: " + err.message);
                  } else {
                    console.log("Employee role updated successfully.");
                  }
                  init();
                }
              );
            });
        });
      });
    }

