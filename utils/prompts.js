const prompts = {
	mainMenuPrompts: [
		{
			type: 'list',
			name: 'mainMenu',
			message: 'What would you like to do?',
			choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Exit'],
		},
	],
	addDepartmentPrompts: [
		{
			type: 'input',
			name: 'departmentName',
			message: 'What is the department name you would like to add?',
			validate: function (input) {
				const trimmedInput = input.trim()
				if (trimmedInput.length < 2) {
					throw new Error( '🚫 Department name must be at least 2 characters. Please try again.')
				} else {
					return true
				}
			},
		},
	],
	addRolePrompts: [
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
	],
}

module.exports = prompts
