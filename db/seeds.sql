
INSERT INTO department (name) VALUES
    ('Market'),
    ('Computer Engineering'),
    ('Aerospace');


INSERT INTO role (title, salary, department_id) VALUES
    ('Manager', 80000.00, 1),
    ('Software Developer', 60000.00, 1),
    ('Sales Representative', 55000.00, 2),
    ('HR Specialist', 50000.00, 3);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('Mike', 'Johnson', 2, 1),
    ('Alice', 'Williams', 3, NULL),
    ('Bob', 'Brown', 4, 3);