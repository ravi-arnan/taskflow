const { pool } = require('../db');

// BUG-FIX: Performance Degradation (N+1 Query Problem)
// Solved by using a LEFT JOIN to fetch the user's name in a single query
// Instead of making a separate database query for each individual task
const TASKS_SELECT_FIELDS = `
  SELECT tasks.*, users.name AS "userName"
  FROM tasks
  LEFT JOIN users ON tasks.user_id = users.id
`;

const mapTaskRow = (task) => ({
  ...task,
  userName: task.userName || 'Unknown',
});

const buildTasksQuery = ({ status, orderByCreatedAtDesc = false } = {}) => {
  const values = [];
  const clauses = [TASKS_SELECT_FIELDS];

  if (status) {
    values.push(status);
    // BUG-FIX: Critical Security Flag (SQL Injection)
    // Solved by using parameterized queries ($1, $2, etc.) to safely pass user input
    // Instead of directly concatenating the variable into the raw SQL string
    clauses.push(`WHERE tasks.status = $${values.length}`);
  }

  if (orderByCreatedAtDesc) {
    clauses.push('ORDER BY tasks.created_at DESC');
  }

  return {
    text: clauses.join('\n'),
    values,
  };
};

const fetchTasks = async ({ status, orderByCreatedAtDesc = false } = {}) => {
  const query = buildTasksQuery({ status, orderByCreatedAtDesc });
  const result = await pool.query(query.text, query.values);

  return result.rows.map(mapTaskRow);
};

const updateTaskStatus = async ({ id, status }) => {
  const query = `
    UPDATE tasks
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [status, id]);

  return result.rows[0] || null;
};

module.exports = {
  fetchTasks,
  updateTaskStatus,
};
