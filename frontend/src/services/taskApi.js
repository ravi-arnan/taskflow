import axios from 'axios';

export const fetchTasksRequest = (params) => axios.get('/api/tasks', { params });

export const exportTasksRequest = (params) =>
  axios.get('/api/tasks/export', {
    params,
    responseType: 'blob',
  });

export const updateTaskStatusRequest = (taskId, status) =>
  axios.put(`/api/tasks/${taskId}/status`, { status });
