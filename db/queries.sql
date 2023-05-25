-- View All Departments
SELECT
    *
FROM
    department;

-- View All Roles
SELECT
    r.title AS 'job_title',
    r.id AS 'role_id',
    d.name AS 'department_name',
    r.salary AS 'role_salary'
FROM
    role r
    JOIN department d ON r.department_id = d.id;

-- View All Employees
SELECT
    e.id AS 'employee_id',
    e.first_name,
    e.last_name,
    r.title AS 'job_title',
    d.name AS 'department_name',
    r.salary,
    CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM
    employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
ORDER BY
    e.id;

-- Add Department
INSERT INTO
    department (name)
VALUES
    (?)