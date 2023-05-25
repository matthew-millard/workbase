-- View All Roles
SELECT
    r.title AS 'job_title',
    r.id AS 'role_id',
    d.name AS 'department_name',
    r.salary AS 'role_salary'
FROM
    role r
JOIN department d 
    ON r.department_id = d.id

