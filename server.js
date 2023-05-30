// Import dependencies
const mysql = require('mysql2')
const inquirer = require('inquirer')
require('dotenv').config()

// Import queries
const queries = require('./db/queries')

// Import Prompts
const { mainMenuPrompts, addDepartmentPrompts, addRolePrompts } = require('./utils/prompts')

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
		const answers = await inquirer.prompt(mainMenuPrompts)
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
			case 'Update Manager':
				updateManager()
				break
			case 'View Employees By Manager':
				viewEmployeesByManager()
				break
			case 'View Employees By Department':
				viewEmployeesByDepartment()
				break
			case 'Exit':
				console.log('You have exited the application.')
				process.exit()
				break
		}
	} catch (error) {
		console.error(`Error: ${error}`)
	}
}

// Executes a database query on a specified table and outputs the results in a table format in the console
async function viewTable(query) {
	try {
		const [results] = await db.query(query)
		console.table(results)
		mainMenu()
	} catch (error) {
		console.error(`Error: ${error}`)
	}
}
// Prompts user for a new department name, validates input length, and executes a database query to insert the department, handling and logging errors as needed.
async function addDepartment() {
	try {
		const answers = await inquirer.prompt(addDepartmentPrompts)
		const depName = answers.departmentName.trim()
		await db.query(queries['Add Department'], depName)
		console.log(`✅ The ${depName} department was successfully added.`)
	} catch (error) {
		console.error(`Error: ${error.message}`)
	} finally {
		mainMenu()
	}
}

// Prompts user for new role details, then executes a database query to insert the role, handling and logging errors as needed.
async function addRole() {
	try {
		const answers = await inquirer.prompt(addRolePrompts)
		const { roleName, salary, departmentId } = answers

		await db.query(queries['Add Role'], [roleName, salary, departmentId])
		console.log(`✅ The ${roleName} role was successfully added.`)
	} catch (error) {
		console.error(`Error: ${error}`)
	} finally {
		mainMenu()
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
		console.error(`Error: ${error}`)
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
		console.error(`Error: ${error}`)
	}
}

// Update employee manager
async function updateManager() {
	try {
		// Query to get all employees
		const [employees] = await db.query('SELECT first_name, last_name FROM employee')
		const allEmployees = employees.map(employee => `${employee.first_name} ${employee.last_name}`)
		const answers = await inquirer.prompt([
			{
				type: 'list',
				name: 'employee',
				message: 'Which employee would you like to update?',
				choices: allEmployees,
			},
			{
				type: 'list',
				name: 'manager',
				message: "Who is the employee's new manager?",
				choices: allEmployees,
			},
		])
		// Destructure answers
		const { employee, manager } = answers
		// Query to get employee id
		const employee_firstName = employee.split(' ')[0]
		const employee_lastName = employee.split(' ')[1]
		const [employeeResult] = await db.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [employee_firstName, employee_lastName])
		const employee_id = employeeResult[0].id
		// Query to get manager id
		const manager_firstName = manager.split(' ')[0]
		const manager_lastName = manager.split(' ')[1]
		const [managerResult] = await db.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [manager_firstName, manager_lastName])
		const manager_id = managerResult[0].id
		// Query to update employee manager
		await db.query('UPDATE employee SET manager_id = ? WHERE id = ?', [manager_id, employee_id])
		console.log(`✅ ${manager} has been updated as manager of ${employee}.`)
		mainMenu()
	} catch (error) {
		console.error(`Error: ${error}`)
	}
}

// View employees by manager
async function viewEmployeesByManager() {
	try {
		// Query to get all managers
		const [managers] = await db.query('SELECT DISTINCT manager_id FROM employee')
		// Remove null values
		managers.forEach((manager, index) => {
			if (manager.manager_id === null) {
				managers.splice(index, 1)
			}
		})

		// Get manager names from manager ids
		const managerNames = []
		for (const manager of managers) {
			const [managerResult] = await db.query('SELECT first_name, last_name FROM employee WHERE id = ?', [manager.manager_id])
			const manager_name = `${managerResult[0].first_name} ${managerResult[0].last_name}`
			managerNames.push(manager_name)
		}
		//  Prompt user to select manager
		const answers = await inquirer.prompt([
			{
				type: 'list',
				name: 'manager',
				message: 'Which manager would you like to view employees for?',
				choices: managerNames,
			},
		])
		// Destructure answers
		const { manager } = answers
		// Query to get manager id
		const manager_firstName = manager.split(' ')[0]
		const manager_lastName = manager.split(' ')[1]
		const [managerResult] = await db.query('SELECT id FROM employee WHERE first_name = ? AND last_name = ?', [manager_firstName, manager_lastName])
		const manager_id = managerResult[0].id
		// Query to get employees by manager
		const [employees] = await db.query('SELECT first_name, last_name FROM employee WHERE manager_id = ?', [manager_id])
		console.table(employees)
		mainMenu()
	} catch (error) {
		console.error(`Error: ${error}`)
	}
}

// View employees by department
async function viewEmployeesByDepartment() {
	try {
		// Query to get all departments
		const [departments] = await db.query('SELECT name FROM department')
		const allDepartments = departments.map(department => department.name)	
		// Prompt user to select department
		const answers = await inquirer.prompt([
			{
				type: 'list',
				name: 'department',
				message: 'Which department would you like to view employees for?',
				choices: allDepartments,
			},
		])
		// Destructure answers
		const { department } = answers
		// Query to get department id
		const [departmentResult] = await db.query('SELECT id FROM department WHERE name = ?', [department])
		const department_id = departmentResult[0].id
		// Query to get employees by department
		const [employees] = await db.query('SELECT first_name, last_name FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ?)', [department_id])
		console.table(employees)
		mainMenu()
	} catch (error) {
		console.error(`Error: ${error}`)
	}
}


// Initializes the application
mainMenu()
