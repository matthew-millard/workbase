INSERT INTO
    department (name)
VALUES
    ('Sales'),
    ('Marketing'),
    ('Finance'),
    ('Human Resources'),
    ('Operations');

INSERT INTO
    role (title, salary, department_id)
VALUES
    ('Sales Executive', 75000.00, 1),
    ('Marketing Executive', 85000.00, 2),
    ('Finance Executive', 90000.00, 3),
    ('HR Manager', 70000.00, 4),
    ('Operations Manager', 80000.00, 5),
    ('Sales Associate', 50000.00, 1),
    ('Marketing Coordinator', 55000.00, 2),
    ('Finance Analyst', 60000.00, 3),
    ('HR Assistant', 45000.00, 4),
    ('Operations Coordinator', 50000.00, 5),
    ('Sales Trainee', 35000.00, 1),
    ('Marketing Intern', 35000.00, 2),
    ('Junior Finance Analyst', 40000.00, 3),
    ('HR Intern', 35000.00, 4),
    ('Operations Assistant', 40000.00, 5);

INSERT INTO
    employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'John', 'Doe', 1, NULL),
    (2, 'Jane', 'Doe', 2, 1),
    (3, 'Bob', 'Smith', 3, 1),
    (4, 'Alice', 'Johnson', 4, 1),
    (5, 'Charlie', 'Brown', 5, 1),
    (6, 'Emily', 'Adams', 2, 2),
    (7, 'Michael', 'Clark', 3, 3),
    (8, 'Sarah', 'Edwards', 4, 4),
    (9, 'William', 'Foster', 5, 5),
    (10, 'Jessica', 'Garcia', 1, 1),
    (11, 'Thomas', 'Harris', 2, 2),
    (12, 'Ashley', 'Jones', 3, 3),
    (13, 'James', 'King', 4, 4),
    (14, 'Jennifer', 'Lee', 5, 5),
    (15, 'Christopher', 'Miller', 1, 1),
    (16, 'Amanda', 'Nelson', 2, 2),
    (17, 'Joshua', 'Perez', 3, 3),
    (18, 'Nicole', 'Roberts', 4, 4),
    (19, 'Brian', 'Taylor', 5, 5),
    (20, 'Rebecca', 'White', 1, 1),
    (21, 'Rachel', 'Anderson', 6, 1),
    (22, 'Daniel', 'Thompson', 7, 2),
    (23, 'Megan', 'Martinez', 8, 3),
    (24, 'Eric', 'Rodriguez', 9, 4),
    (25, 'Heather', 'Lewis', 10, 5),
    (26, 'Jason', 'Walker', 11, 1),
    (27, 'Melissa', 'Hall', 12, 2),
    (28, 'Matthew', 'Allen', 13, 3),
    (29, 'Stephanie', 'Young', 14, 4),
    (30, 'Timothy', 'Hernandez', 15, 5);