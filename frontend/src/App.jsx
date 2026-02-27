import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskCard from './components/TaskCard';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

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

  // BUG 3: Direct State Mutation
  // This function mutates the state directly instead of creating a new array
  // This will cause the UI to not re-render properly
  const markCompleted = async (taskId) => {
    try {
      // First, call the API to update the task
      await axios.put(`/api/tasks/${taskId}/status`, { status: 'completed' });
      
      // BUG: Direct state mutation - this won't trigger a re-render
      // The correct way would be to use .map() or spread operators to create a new array
      const currentTasks = tasks;
      currentTasks.find(t => t.id === taskId).status = 'completed';
      setTasks(currentTasks);
      
      // Note: The UI won't update immediately because React doesn't detect the change
      // You would need to refresh or fetch tasks again to see the update
      
    } catch (err) {
      console.error('Error marking task as completed:', err);
      alert('Failed to update task: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-800 text-lg font-semibold mb-2">Error</p>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={fetchTasks}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">TaskFlow</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>

        {/* Filter Section */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <label className="text-gray-700 font-medium">Filter by Status:</label>
            <select 
              value={filter} 
              onChange={handleFilterChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button 
              onClick={applyFilter}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Apply Filter
            </button>
          </div>
        </div>

        {/* Tasks Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{tasks.length}</span> tasks
          </p>
        </div>

        {/* Tasks Grid */}
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-600 text-lg">No tasks found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onMarkCompleted={markCompleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
