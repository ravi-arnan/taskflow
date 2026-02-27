-- TaskFlow Database Initialization Script
-- Run this script to set up the database schema and seed data

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy users
INSERT INTO users (id, name, email) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john.doe@example.com'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'jane.smith@example.com'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Bob Johnson', 'bob.johnson@example.com');

-- Insert dummy tasks (distributed among users)
INSERT INTO tasks (id, title, description, status, user_id) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Complete project proposal', 'Write and submit the Q4 project proposal document', 'pending', '550e8400-e29b-41d4-a716-446655440001'),
    ('660e8400-e29b-41d4-a716-446655440002', 'Review code changes', 'Review the pull requests from the development team', 'in-progress', '550e8400-e29b-41d4-a716-446655440001'),
    ('660e8400-e29b-41d4-a716-446655440003', 'Update documentation', 'Update API documentation with new endpoints', 'pending', '550e8400-e29b-41d4-a716-446655440002'),
    ('660e8400-e29b-41d4-a716-446655440004', 'Fix login bug', 'Fix the authentication issue reported by users', 'completed', '550e8400-e29b-41d4-a716-446655440002'),
    ('660e8400-e29b-41d4-a716-446655440005', 'Database optimization', 'Optimize slow queries in the reporting module', 'in-progress', '550e8400-e29b-41d4-a716-446655440002'),
    ('660e8400-e29b-41d4-a716-446655440006', 'Design new dashboard', 'Create mockups for the new analytics dashboard', 'pending', '550e8400-e29b-41d4-a716-446655440003'),
    ('660e8400-e29b-41d4-a716-446655440007', 'Write unit tests', 'Add unit tests for the payment module', 'pending', '550e8400-e29b-41d4-a716-446655440003'),
    ('660e8400-e29b-41d4-a716-446655440008', 'Deploy to staging', 'Deploy latest changes to staging environment', 'completed', '550e8400-e29b-41d4-a716-446655440001'),
    ('660e8400-e29b-41d4-a716-446655440009', 'Client meeting prep', 'Prepare presentation for client demo', 'in-progress', '550e8400-e29b-41d4-a716-446655440001'),
    ('660e8400-e29b-41d4-a716-446655440010', 'Security audit', 'Conduct security audit of the application', 'pending', '550e8400-e29b-41d4-a716-446655440002'),
    ('660e8400-e29b-41d4-a716-446655440011', 'Performance testing', 'Run load tests on the API endpoints', 'pending', '550e8400-e29b-41d4-a716-446655440003'),
    ('660e8400-e29b-41d4-a716-446655440012', 'Update dependencies', 'Update npm packages to latest versions', 'completed', '550e8400-e29b-41d4-a716-446655440003');

-- Create indexes for better query performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_users_email ON users(email);

-- Verify the data
SELECT 'Users:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Tasks:', COUNT(*) FROM tasks;
