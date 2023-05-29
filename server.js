// Import dependencies
const mysql = require('mysql2')
const inquirer = require('inquirer')
require('dotenv').config()

// Import queries
const queries = require('./db/queries')

// MySQL Connection - Promisified
const db = mysql
	.createConnection({
		host: 'localhost',
		user: 'root',
		password: process.env.DB_PASSWORD,
		database: 'workbase',
	})
	.promise()

// Main Menu
async function mainMenu() {
	try {
		const answers = await inquirer.prompt([
			{
				type: 'list',
				name: 'mainMenu',
				message: 'What would you like to do?',
				choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Exit'],
			},
		])
		switch (answers.mainMenu) {
			case 'View All Departments':
				await viewTable(queries['View All Departments'])
				break
			case 'View All Roles':
				await viewTable(queries['View All Roles'])
				break
			case 'View All Employees':
				await viewTable(queries['View All Employees'])
				break
			case 'Add A Department':
				await addDepartment()
				break
			case 'Add A Role':
				await addRole()
				break
			case 'Add An Employee':
				await addEmployee()
				break
			case 'Update An Employee Role':
				updateEmployee()
				break
			case 'Exit':
				console.log('You have exited the application.')
				process.exit()
				break
		}
	} catch (error) {
		console.error(error)
	}
}

// Executes a database query on a specified table and outputs the results in a table format in the console
async function viewTable(query) {
	try {
		const [results] = await db.query(query)
		console.table(results)
		mainMenu()
	} catch (error) {
		console.error(error)
	}
}
// Prompts user for a new department name, validates input length, and executes a database query to insert the department, handling and logging errors as needed.
async function addDepartment() {
	try {
		const answers = await inquirer.prompt([
			{
				type: 'input',
				name: 'departmentName',
				message: 'What is the department name you would like to add?',
			},
		])

		const depName = answers.departmentName.trim()
		if (depName.length < 2) {
			console.error('🚫 Error: Department name must be at least 2 characters.')
			return mainMenu()
		}
		await db.query(queries['Add Department'], depName)
		console.log(`✅ The ${depName} department was successfully added.`)
		mainMenu()
	} catch (error) {
		console.error(error)
	}
}

// Prompts user for new role details, then executes a database query to insert the role, handling and logging errors as needed.
async function addRole() {
	try {
		const answers = await inquirer.prompt([
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
		// Destructure answers object
		const { roleName, salary, departmentId } = answers

		await db.query(queries['Add Role'], [roleName, salary, departmentId])
		console.log(`✅ The ${roleName} role was successfully added.`)
		mainMenu()
	} catch (error) {
		console.error(error)
	}
}

async function addEmployee() {
	try {
		// Query to get all roles
		const [roles] = await db.query('SELECT title FROM role')
		const allRoles = roles.map(role => role.title)
		// Query to get all employees
		const [employees] = await db.query('SELECT first_name, last_name FROM employee')
		const allEmployees = employees.map(employee => `${employee.first_name} ${employee.last_name}`)
		const answers = await inquirer.prompt([
			{
				type: 'input',
				name: 'firstName',
				message: 'What is the first name of the employee you would like to add?',
			},
			{
				type: 'input',
				name: 'lastName',
				message: 'What is the last name of the employee you would like to add?',
			},
			{
				type: 'list',
				name: 'role',
				message: 'What is the role of the employee you would like to add?',
				choices: allRoles,
			},
			{
				type: 'list',
				name: 'manager',
				message: 'Who is the manager of the employee you would like to add?',
				choices: allEmployees,
			},
		])
		// Destructure answers
		const { firstName, lastName, role, manager } = answers
		// Query to get role id
		const [result] = await db.query('SELECT id FROM role WHERE title = ?', [role])
		const role_Id = result[0].id
		// Query to get manager id
		const manager_firstName = manager.split(' ')[0]
		const manager_lastName = manager.split(' ')[1]
		const [managerResult] = await db.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [manager_firstName, manager_lastName])
		const manager_id = managerResult[0].id

		// Query to add employee
		await db.query('INSERT INTO employee (first_name, last_name, role_Id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, role_Id, manager_id])
		console.log(`✅ ${firstName} ${lastName} was successfully added as a new employee.`)
		mainMenu()
	} catch (error) {
		console.error(error)
	}
}

// Update employee role
async function updateEmployee() {
	try {
		// Query to get all employees
		const [employees] = await db.query('SELECT first_name, last_name FROM employee')
		const allEmployees = employees.map(employee => `${employee.first_name} ${employee.last_name}`)
		// Query to get all roles
		const [roles] = await db.query('SELECT title FROM role')
		const allRoles = roles.map(role => role.title)
		const answers = await inquirer.prompt([
			{
				type: 'list',
				name: 'employee',
				message: 'Which employee would you like to update?',
				choices: allEmployees,
			},
			{
				type: 'list',
				name: 'role',
				message: "What is the employee's new role?",
				choices: allRoles,
			},
		])
		// Destructure answers
		const { employee, role } = answers
		// Query to get employee id
		const employee_firstName = employee.split(' ')[0]
		const employee_lastName = employee.split(' ')[1]
		const [employeeResult] = await db.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [employee_firstName, employee_lastName])
		const employee_id = employeeResult[0].id
		// Query to get role id
		const [roleResult] = await db.query('SELECT id FROM role WHERE title = ?', [role])
		const role_id = roleResult[0].id
		// Query to update employee role
		await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [role_id, employee_id])
		console.log(`✅ ${employee} was successfully updated to ${role}.`)
		mainMenu()
	} catch (error) {
		console.error(error)
	}
}

// Initializes the application
mainMenu()
