import React from 'react';

import { STATUS_OPTIONS } from '../constants/taskOptions';

const TaskToolbar = ({
  filter,
  isExporting,
  onFilterChange,
  onApplyFilter,
  onExport,
}) => (
  <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Filters</h2>
        <p className="mt-2 text-sm text-slate-600">Narrow the board and export the same result set.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={filter}
          onChange={onFilterChange}
          className="min-w-[220px] rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value || 'all'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={onApplyFilter}
          className="rounded-full border border-slate-200 bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Apply filter
        </button>

        <button
          onClick={onExport}
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
);

export default TaskToolbar;
