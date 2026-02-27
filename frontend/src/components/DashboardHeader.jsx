import React from 'react';

const DashboardHeader = ({ activeFilterLabel }) => (
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
);

export default DashboardHeader;
