import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from './components/TaskCard';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = filter ? { status: filter } : {};
      const response = await axios.get('/api/tasks', { params });
      setTasks(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks: ' + err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const applyFilter = () => {
    fetchTasks();
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const params = filter ? { status: filter } : {};
      const response = await axios.get('/api/tasks/export', {
        params,
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tasks${filter ? '-' + filter : ''}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting tasks:', err);
      alert('Failed to export tasks. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const markCompleted = async (taskId) => {
    try {
      await axios.put(`/api/tasks/${taskId}/status`, { status: 'completed' });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: 'completed' } : task
        )
      );
    } catch (err) {
      console.error('Error marking task as completed:', err);
      alert('Failed to update task: ' + err.message);
    }
  };

  const stats = tasks.reduce(
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

  const activeFilterLabel =
    STATUS_OPTIONS.find((option) => option.value === filter)?.label || 'All statuses';

  const statCards = [
    { label: 'Total', value: stats.total },
    { label: 'Pending', value: stats.pending },
    { label: 'In progress', value: stats.inProgress },
    { label: 'Completed', value: stats.completed },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7f4] px-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900"></div>
          <p className="mt-4 text-sm text-slate-500">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7f4] px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-rose-500">Error</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Dashboard unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">TaskFlow</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Clean task management for daily operations
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Review tasks, filter the current workload, and export exactly what is visible on the screen.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Current view: <span className="font-medium text-slate-900">{activeFilterLabel}</span>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Filters</h2>
              <p className="mt-2 text-sm text-slate-600">Narrow the board and export the same result set.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={filter}
                onChange={handleFilterChange}
                className="min-w-[220px] rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={applyFilter}
                className="rounded-full border border-slate-200 bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Apply filter
              </button>

              <button
                onClick={handleExportCSV}
                disabled={isExporting}
                className={`rounded-full px-5 py-3 text-sm font-medium transition ${
                  isExporting
                    ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'
                    : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
                }`}
              >
                {isExporting ? 'Preparing CSV...' : 'Download CSV'}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Tasks</h2>
            <p className="text-sm text-slate-500">
              {tasks.length} {tasks.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <p className="text-lg font-medium text-slate-900">No tasks found</p>
              <p className="mt-2 text-sm text-slate-600">Try changing the filter and request the list again.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onMarkCompleted={markCompleted} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
