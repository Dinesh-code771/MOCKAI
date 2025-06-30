-- seed roles
INSERT INTO roles (name, description) VALUES 
('admin', 'System administrator with full access'),
('instructor', 'Course instructor and interview creator'),
('student', 'Regular student user')
ON CONFLICT(name) DO NOTHING;

-- seed courses
INSERT INTO courses (name, description) VALUES
('Python Full Stack', 'Python full stack development course'),
('Java Full Stack', 'Java full stack development course'),
('Frontend Development', 'Frontend development course'),
('Database Management', 'Database management course')
ON CONFLICT(name) DO NOTHING;