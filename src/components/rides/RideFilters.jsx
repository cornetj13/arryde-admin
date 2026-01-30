export default function RideFilters({ filter, onFilterChange }) {
  const filters = [
    { value: 'all', label: 'All Rides' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'completed', label: 'Completed' },
    { value: 'canceled', label: 'Canceled' },
    { value: 'expired', label: 'Expired' },
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
