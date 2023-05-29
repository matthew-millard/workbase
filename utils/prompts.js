const prompts = {
	mainMenuPrompts: [
		{
			type: 'list',
			name: 'mainMenu',
			message: 'What would you like to do?',
			choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Exit'],
		},
	],
	addDepartmentPrompt: [
		{
			type: 'input',
			name: 'departmentName',
			message: 'What is the department name you would like to add?',
		},
	],
}

module.exports = prompts
