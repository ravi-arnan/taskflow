import React from 'react';

const StateScreen = ({ title, description, actionLabel, onAction, loading = false, tone = 'default' }) => {
  const toneClassName =
    tone === 'error' ? 'text-rose-500' : 'text-slate-500';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f7f4] px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {loading ? (
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900"></div>
        ) : (
          <p className={`text-sm font-medium ${toneClassName}`}>{tone === 'error' ? 'Error' : 'Loading'}</p>
        )}
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        {actionLabel && onAction ? (
          <button
            onClick={onAction}
            className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default StateScreen;
