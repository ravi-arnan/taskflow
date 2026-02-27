import React from 'react';

const statusConfig = {
  pending: {
    label: 'Pending',
    badge: 'bg-amber-50 text-amber-700',
  },
  'in-progress': {
    label: 'In progress',
    badge: 'bg-sky-50 text-sky-700',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-emerald-50 text-emerald-700',
  },
};

const formatDate = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }

  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const TaskCard = ({ task, onMarkCompleted }) => {
  const config = statusConfig[task.status] || {
    label: task.status,
    badge: 'bg-slate-100 text-slate-700',
  };

  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-500">Assigned to {task.userName}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${config.badge}`}>
          {config.label}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {task.description || 'No description provided.'}
      </p>

      <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
        <span>Created {formatDate(task.created_at)}</span>
        <span>ID {task.id.slice(0, 8)}</span>
      </div>

      {task.status !== 'completed' ? (
        <button
          onClick={() => onMarkCompleted(task.id)}
          className="mt-5 w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Mark as Completed
        </button>
      ) : (
        <div className="mt-5 w-full rounded-full bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-600">
          Completed
        </div>
      )}
    </article>
  );
};

export default TaskCard;
