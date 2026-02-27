const CSV_HEADERS = ['ID', 'Title', 'Description', 'Status', 'Assigned User', 'Created Date'];

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  const text = String(value);

  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
};

const buildTasksCsv = (tasks) => {
  const rows = tasks.map((task) => [
    escapeCsvValue(task.id),
    escapeCsvValue(task.title),
    escapeCsvValue(task.description),
    escapeCsvValue(task.status),
    escapeCsvValue(task.userName),
    escapeCsvValue(new Date(task.created_at).toISOString()),
  ]);

  return [CSV_HEADERS, ...rows].map((row) => row.join(',')).join('\n');
};

module.exports = {
  buildTasksCsv,
};
