const TASK_STATUSES = ['pending', 'in-progress', 'completed'];

const isValidTaskStatus = (status) => TASK_STATUSES.includes(status);

module.exports = {
  TASK_STATUSES,
  isValidTaskStatus,
};
