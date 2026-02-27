import React from 'react';

import { TASK_STATUS_CONFIG } from '../constants/taskOptions';
import { formatTaskDate } from '../utils/taskUtils';

const TaskCard = ({ task, onMarkCompleted }) => {
  const statusConfig = TASK_STATUS_CONFIG[task.status] || {
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
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusConfig.badge}`}>
          {statusConfig.label}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {task.description || 'No description provided.'}
      </p>

      <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
        <span>Created {formatTaskDate(task.created_at)}</span>
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
