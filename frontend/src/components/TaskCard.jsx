import React from 'react';

const TaskCard = ({ task, onMarkCompleted }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex-1">
          {task.title}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {task.description || 'No description'}
      </p>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{task.userName}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(task.created_at)}</span>
        </div>
      </div>
      
      {task.status !== 'completed' && (
        <button
          onClick={() => onMarkCompleted(task.id)}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors duration-200 font-medium"
        >
          Mark as Completed
        </button>
      )}
      
      {task.status === 'completed' && (
        <div className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded text-center font-medium">
          ✓ Completed
        </div>
      )}
    </div>
  );
};

export default TaskCard;
