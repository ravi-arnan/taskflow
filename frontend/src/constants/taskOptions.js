export const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
];

export const TASK_STATUS_CONFIG = {
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
