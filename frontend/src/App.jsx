import React, { useEffect, useState } from 'react';

import DashboardHeader from './components/DashboardHeader';
import EmptyState from './components/EmptyState';
import StateScreen from './components/StateScreen';
import StatCard from './components/StatCard';
import TaskCard from './components/TaskCard';
import TaskToolbar from './components/TaskToolbar';
import {
  exportTasksRequest,
  fetchTasksRequest,
  updateTaskStatusRequest,
} from './services/taskApi';
import {
  buildExportFileName,
  buildTaskFilterParams,
  calculateTaskStats,
  getActiveFilterLabel,
} from './utils/taskUtils';

const triggerCsvDownload = (blobData, fileName) => {
  const blob = new Blob([blobData], { type: 'text/csv' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = downloadUrl;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const loadTasks = async () => {
    try {
      setLoading(true);

      const params = buildTaskFilterParams(filter);
      const response = await fetchTasksRequest(params);

      setTasks(response.data.data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch tasks: ${err.message}`);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const params = buildTaskFilterParams(filter);
      const response = await exportTasksRequest(params);

      triggerCsvDownload(response.data, buildExportFileName(filter));
    } catch (err) {
      console.error('Error exporting tasks:', err);
      alert('Failed to export tasks. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleMarkCompleted = async (taskId) => {
    try {
      await updateTaskStatusRequest(taskId, 'completed');

      // BUG-FIX: Poor UX (Broken Reactivity)
      // Solved by updating state immutably using .map() to create a new array.
      // Modifying the array directly (currentTasks.find().status = ...) prevented UI re-renders.
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, status: 'completed' } : task
        )
      );
    } catch (err) {
      console.error('Error marking task as completed:', err);
      alert(`Failed to update task: ${err.message}`);
    }
  };

  const taskStats = calculateTaskStats(tasks);
  const activeFilterLabel = getActiveFilterLabel(filter);
  const statCards = [
    { label: 'Total', value: taskStats.total },
    { label: 'Pending', value: taskStats.pending },
    { label: 'In progress', value: taskStats.inProgress },
    { label: 'Completed', value: taskStats.completed },
  ];

  if (loading) {
    return (
      <StateScreen
        loading
        title="Loading tasks"
        description="Fetching the latest task data from the API."
      />
    );
  }

  if (error) {
    return (
      <StateScreen
        tone="error"
        title="Dashboard unavailable"
        description={error}
        actionLabel="Retry"
        onAction={loadTasks}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f4] text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <DashboardHeader activeFilterLabel={activeFilterLabel} />

        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <StatCard key={card.label} label={card.label} value={card.value} />
          ))}
        </section>

        <TaskToolbar
          filter={filter}
          isExporting={isExporting}
          onFilterChange={handleFilterChange}
          onApplyFilter={loadTasks}
          onExport={handleExport}
        />

        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Tasks</h2>
            <p className="text-sm text-slate-500">
              {tasks.length} {tasks.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onMarkCompleted={handleMarkCompleted} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
