import { FiEye, FiPhone, FiMail } from 'react-icons/fi';
import { StatusBadge } from '../shared';

// Format the next available time
const formatNextAvailable = (timestamp) => {
  if (!timestamp) return 'Available Now';

  const now = Date.now();
  const availableTime = parseInt(timestamp);

  // If the time is in the past, they're available now
  if (availableTime <= now) return 'Available Now';

  const diffMs = availableTime - now;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return 'Available Now';
  if (diffMins < 60) return `${diffMins} min`;
  if (diffHours < 24) {
    const remainingMins = diffMins % 60;
    return remainingMins > 0 ? `${diffHours}h ${remainingMins}m` : `${diffHours}h`;
  }

  // Format as time if more than 24 hours
  return new Date(availableTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default function DriverTable({ drivers, onViewDriver }) {
  if (drivers.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-admin-500">No drivers found</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="min-w-full divide-y divide-admin-200">
        <thead className="bg-admin-50">
          <tr>
            <th className="table-header">Driver</th>
            <th className="table-header">Contact</th>
            <th className="table-header">Vehicle</th>
            <th className="table-header">Rides</th>
            <th className="table-header">Login</th>
            <th className="table-header">Duty</th>
            <th className="table-header">Next Available</th>
            <th className="table-header text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-admin-200">
          {drivers.map((driver) => (
            <tr key={driver.id} className="hover:bg-admin-50 transition-colors">
              <td className="table-cell">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-arryde-driver/10 flex items-center justify-center">
                      <span className="text-arryde-driver font-medium">
                        {driver.name?.charAt(0)?.toUpperCase() || 'D'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-admin-900">{driver.name}</div>
                    <div className="text-sm text-admin-500">ID: {driver.id}</div>
                  </div>
                </div>
              </td>
              <td className="table-cell">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-admin-600">
                    <FiMail size={14} />
                    <span>{driver.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-admin-600">
                    <FiPhone size={14} />
                    <span>{driver.phoneNumber}</span>
                  </div>
                </div>
              </td>
              <td className="table-cell">
                {driver.carMake ? (
                  <div>
                    <div className="text-sm font-medium text-admin-900">
                      {driver.carColor} {driver.carMake} {driver.carModel}
                    </div>
                    <div className="text-sm text-admin-500">{driver.licensePlate}</div>
                  </div>
                ) : (
                  <span className="text-admin-400">No vehicle info</span>
                )}
              </td>
              <td className="table-cell">
                <div className="text-sm">
                  <div className="font-medium text-admin-900">
                    {driver.completedRidesTotal || 0} completed
                  </div>
                  <div className="text-admin-500">
                    {driver.acceptedRidesTotal || 0} accepted
                  </div>
                </div>
              </td>
              <td className="table-cell">
                <StatusBadge status={driver.isLoggedIn} type="login" />
              </td>
              <td className="table-cell">
                <StatusBadge status={driver.isOnDuty} type="duty" />
              </td>
              <td className="table-cell">
                <span className={`text-sm font-medium ${
                  formatNextAvailable(driver.driverNextAvailableAt) === 'Available Now'
                    ? 'text-green-600'
                    : 'text-admin-600'
                }`}>
                  {formatNextAvailable(driver.driverNextAvailableAt)}
                </span>
              </td>
              <td className="table-cell text-right">
                <button
                  onClick={() => onViewDriver(driver)}
                  className="text-admin-500 hover:text-admin-700 p-2"
                  title="View details"
                >
                  <FiEye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
