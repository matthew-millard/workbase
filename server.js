// Imports
const mysql = require('mysql2')
const inquirer = require('inquirer')
const queries = require('./db/queries')
require('dotenv').config()

// MySQL Connection
const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: process.env.DB_PASSWORD,
	database: 'workbase',
})

// Main Menu
function mainMenu() {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'mainMenu',
				message: 'What would you like to do?',
				choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role'],
			},
		])
		.then(answers => {
			switch (answers.mainMenu) {
				case 'View All Departments':
					viewTable(queries['View All Departments'])
					break
				case 'View All Roles':
					viewTable(queries['View All Roles'])
					break
				case 'View All Employees':
					query = 'SELECT * FROM ??'
					viewTable(queries['View All Employees'])
					break
				case 'Add A Department':
					addDepartment()
					break
				case 'Add A Role':
					addRole()
					break
				case 'Add An Employee':
					addEmployee()
					break
				case 'Update An Employee Role':
					updateEmployee()
					break
			}
		})
}

// Executes a database query on a specified table and outputs the results in a table format in the console
function viewTable(query) {
	db.query(query, (err, results) => {
		if (err) throw err
		console.table(results)
		mainMenu()
	})
}

// Prompts user for a new department name, validates input length, and executes a database query to insert the department, handling and logging errors as needed.
function addDepartment() {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'departmentName',
				message: 'What is the department name you would like to add?',
			},
		])
		.then(answers => {
			const depName = answers.departmentName.trim()
			if (depName.length < 2) {
				console.error('🚫 Error: Department name must be at least 2 characters.')
				return mainMenu()
			}
			db.query(queries['Add Department'], depName, (err, result) => {
				if (err) {
					throw err
				}
				console.log(`✅ The ${depName} department was successfully added.`)
				mainMenu()
			})
		})
		.catch(error => {
			console.error(error)
		})
}

// Prompts user for new role details, then executes a database query to insert the role, handling and logging errors as needed.
function addRole() {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'roleName',
				message: 'What is the name of the role you would like to add?',
			},
			{
				type: 'number',
				name: 'salary',
				message: 'What is the salary associated with the role?',
			},
			{
				type: 'number',
				name: 'departmentId',
				message: 'What is the department id associated with this role?',
			},
		])
		.then(answers => {
			const { roleName, salary, departmentId } = answers
			db.query(queries['Add Role'], [roleName, salary, departmentId], (err, result) => {
				if (err) {
					throw err
				}
				console.log(`✅ The ${roleName} role was successfully added.`)
				mainMenu()
			})
		})
		.catch(error => {
			console.error(error)
		})
}




// Initiate Program
mainMenu()
