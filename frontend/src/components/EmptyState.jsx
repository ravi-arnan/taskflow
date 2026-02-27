import React from 'react';

const EmptyState = () => (
  <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
    <p className="text-lg font-medium text-slate-900">No tasks found</p>
    <p className="mt-2 text-sm text-slate-600">Try changing the filter and request the list again.</p>
  </div>
);

export default EmptyState;
