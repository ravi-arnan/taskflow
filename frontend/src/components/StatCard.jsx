import React from 'react';

const StatCard = ({ label, value }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
  </div>
);

export default StatCard;
