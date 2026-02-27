require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { verifyDatabaseConnection, pool } = require('./db');
const { TASK_STATUSES, isValidTaskStatus } = require('./constants/taskStatus');
const { fetchTasks, updateTaskStatus } = require('./services/taskService');
const { buildTasksCsv } = require('./utils/csv');
const { sendError, sendSuccess } = require('./utils/http');

const app = express();
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const getStatusFilter = (value) => value || undefined;

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await fetchTasks({ status: getStatusFilter(req.query.status) });

    sendSuccess(res, {
      data: tasks,
      count: tasks.length,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    sendError(res, 500, 'Failed to fetch tasks', error.message);
  }
});

app.put('/api/tasks/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidTaskStatus(status)) {
      return sendError(
        res,
        400,
        'Invalid status',
        `Status must be one of: ${TASK_STATUSES.join(', ')}`
      );
    }

    const updatedTask = await updateTaskStatus({ id, status });

    if (!updatedTask) {
      return sendError(res, 404, 'Task not found', `No task found with id ${id}`);
    }

    return sendSuccess(res, {
      data: updatedTask,
      message: 'Task status updated successfully',
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    return sendError(res, 500, 'Failed to update task status', error.message);
  }
});

app.get('/api/tasks/export', async (req, res) => {
  try {
    const status = getStatusFilter(req.query.status);
    const tasks = await fetchTasks({ status, orderByCreatedAtDesc: true });
    const csv = buildTasksCsv(tasks);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=tasks${status ? `-${status}` : ''}.csv`
    );
    res.send(csv);
  } catch (error) {
    console.error('Error exporting tasks:', error);
    sendError(res, 500, 'Failed to export tasks', error.message);
  }
});

app.get('/api/health', (req, res) => {
  sendSuccess(res, {
    message: 'TaskFlow API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  sendError(res, 500, 'Internal server error', err.message);
});

const server = app.listen(PORT, HOST, async () => {
  console.log(`TaskFlow API server running on http://${HOST}:${PORT}`);
  console.log(`Health check: http://${HOST}:${PORT}/api/health`);

  try {
    await verifyDatabaseConnection();
  } catch (error) {
    console.error('Database connection error:', error.stack);
  }
});

server.on('error', (error) => {
  console.error(`Failed to start server on ${HOST}:${PORT}`, error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});
