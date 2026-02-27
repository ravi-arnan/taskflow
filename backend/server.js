require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'taskflow',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
    release();
  }
});

// GET /api/tasks - Fetch tasks with optional status filter
// NOTE: This endpoint has intentional bugs for the assessment
app.get('/api/tasks', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query;
    
    // BUG 1: SQL Injection Vulnerability
    // The status parameter is directly concatenated into the SQL query
    // This allows SQL injection attacks
    if (status) {
      query = "SELECT * FROM tasks WHERE status = '" + status + "'";
    } else {
      query = "SELECT * FROM tasks";
    }
    
    const result = await pool.query(query);
    const tasks = result.rows;
    
    // BUG 2: N+1 Query Problem
    // For each task, we make a separate query to fetch the user's name
    // This is inefficient and should use a JOIN instead
    const tasksWithUsers = [];
    
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      
      // Make a separate database query for each task to get user name
      const userQuery = "SELECT name FROM users WHERE id = '" + task.user_id + "'";
      const userResult = await pool.query(userQuery);
      
      const taskWithUser = {
        ...task,
        userName: userResult.rows[0]?.name || 'Unknown'
      };
      
      tasksWithUsers.push(taskWithUser);
    }
    
    res.json({
      success: true,
      data: tasksWithUsers,
      count: tasksWithUsers.length
    });
    
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks',
      message: error.message
    });
  }
});

// PUT /api/tasks/:id/status - Update task status
// This endpoint is written correctly (for comparison)
app.put('/api/tasks/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
        message: 'Status must be one of: pending, in-progress, completed'
      });
    }
    
    // Use parameterized query (CORRECT WAY)
    const query = 'UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        message: `No task found with id ${id}`
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Task status updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update task status',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`TaskFlow API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});
