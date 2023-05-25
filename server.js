// Imports
const mysql = require('mysql2')
const inquirer = require('inquirer')
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
			let query
			switch (answers.mainMenu) {
				case 'View All Departments':
					query = 'SELECT * FROM ??'
					viewTable('department', query)
					break
				case 'View All Roles':
					query = 'SELECT * FROM ??'
					viewTable('role', query)
					break
				case 'View All Employees':
					query = 'SELECT * FROM ??'
					viewTable('employee', query)
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
function viewTable(tableName, query) {
	db.query(query, [tableName], (err, results) => {
		if (err) throw err
		console.table(results)
		mainMenu()
	})
}

// Initiate Program
mainMenu()
