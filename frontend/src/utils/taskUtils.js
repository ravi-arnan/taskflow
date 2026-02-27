import { STATUS_OPTIONS } from '../constants/taskOptions';

export const buildTaskFilterParams = (filter) => (filter ? { status: filter } : {});

export const buildExportFileName = (filter) => `tasks${filter ? `-${filter}` : ''}.csv`;

export const calculateTaskStats = (tasks) =>
  tasks.reduce(
    (summary, task) => {
      summary.total += 1;

      if (task.status === 'pending') {
        summary.pending += 1;
      }

      if (task.status === 'in-progress') {
        summary.inProgress += 1;
      }

      if (task.status === 'completed') {
        summary.completed += 1;
      }

      return summary;
    },
    { total: 0, pending: 0, inProgress: 0, completed: 0 }
  );

export const getActiveFilterLabel = (filter) =>
  STATUS_OPTIONS.find((option) => option.value === filter)?.label || 'All statuses';

export const formatTaskDate = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }

  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
