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
    const values = [];

    // FIXED BUG 1: SQL Injection Vulnerability
    // FIXED BUG 2: N+1 Query Problem
    if (status) {
      query = `
        SELECT tasks.*, users.name as "userName"
        FROM tasks
        LEFT JOIN users ON tasks.user_id = users.id
        WHERE tasks.status = $1
      `;
      values.push(status);
    } else {
      query = `
        SELECT tasks.*, users.name as "userName"
        FROM tasks
        LEFT JOIN users ON tasks.user_id = users.id
      `;
    }

    const result = await pool.query(query, values);

    // Handle null/missing usernames gracefully to match prior behavior
    const tasksWithUsers = result.rows.map(task => ({
      ...task,
      userName: task.userName || 'Unknown'
    }));

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
