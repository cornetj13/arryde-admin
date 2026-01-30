export default function DriverFilters({ filter, onFilterChange }) {
  const filters = [
    { value: 'all', label: 'All Drivers' },
    { value: 'on-duty', label: 'On Duty' },
    { value: 'off-duty', label: 'Off Duty' },
    { value: 'logged-in', label: 'Logged In' },
    { value: 'logged-out', label: 'Logged Out' },
  ];

  return (
    <div className="flex gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onFilterChange(f.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === f.value
              ? 'bg-admin-900 text-white'
              : 'bg-admin-100 text-admin-600 hover:bg-admin-200'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
