import { useState, useEffect } from 'react';
import { FiPhone, FiMail } from 'react-icons/fi';
import { StatusBadge } from '../shared';

// Format the wait time since rider started waiting
const formatWaitTime = (timestamp, rideFlowStatus, currentTime) => {
  // If not in WAITING status, they're not waiting
  if (rideFlowStatus !== 'WAITING' || !timestamp) return 'Not Waiting';

  const now = currentTime || Date.now();
  const waitingStarted = parseInt(timestamp);

  // If the timestamp is in the future somehow, they just started
  if (waitingStarted > now) return 'Just started';

  const diffMs = now - waitingStarted;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return 'Just started';
  if (diffMins < 60) return `${diffMins} min`;
  if (diffHours < 24) {
    const remainingMins = diffMins % 60;
    return remainingMins > 0 ? `${diffHours}h ${remainingMins}m` : `${diffHours}h`;
  }

  // More than 24 hours
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ${diffHours % 24}h`;
};

export default function RiderTable({ riders, onViewRider }) {
  // State to force re-render every minute for updating wait times
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Check if any riders are currently waiting
  const hasWaitingRiders = riders.some(rider => rider.rideFlowStatus === 'WAITING');

  // Update the current time every minute to refresh wait times
  useEffect(() => {
    if (!hasWaitingRiders) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [hasWaitingRiders]);

  if (riders.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-admin-500">No riders found</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="min-w-full divide-y divide-admin-200">
        <thead className="bg-admin-50">
          <tr>
            <th className="table-header">Rider</th>
            <th className="table-header">Contact</th>
            <th className="table-header">Rides</th>
            <th className="table-header">Login</th>
            <th className="table-header">Ride Status</th>
            <th className="table-header">Wait Time</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-admin-200">
          {riders.map((rider) => (
            <tr key={rider.id} className="hover:bg-admin-50 transition-colors cursor-pointer" onClick={() => onViewRider(rider)}>
              <td className="table-cell">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-arryde-rider/10 flex items-center justify-center">
                      <span className="text-arryde-rider font-medium">
                        {rider.name?.charAt(0)?.toUpperCase() || 'R'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-admin-900">{rider.name}</div>
                    <div className="text-sm text-admin-500">ID: {rider.id}</div>
                  </div>
                </div>
              </td>
              <td className="table-cell">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-admin-600">
                    <FiMail size={14} />
                    <span>{rider.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-admin-600">
                    <FiPhone size={14} />
                    <span>{rider.phoneNumber}</span>
                  </div>
                </div>
              </td>
              <td className="table-cell">
                <div className="text-sm">
                  <div className="font-medium text-admin-900">
                    {rider.completedRidesTotal || 0} completed
                  </div>
                  <div className="text-admin-500">
                    {rider.requestedRidesTotal || 0} requested
                  </div>
                </div>
              </td>
              <td className="table-cell">
                <StatusBadge status={rider.isLoggedIn} type="login" />
              </td>
              <td className="table-cell">
                <StatusBadge status={rider.rideFlowStatus || 'NONE'} type="rideFlow" />
              </td>
              <td className="table-cell">
                <span className={`text-sm font-medium ${
                  rider.rideFlowStatus === 'WAITING'
                    ? 'text-amber-600'
                    : 'text-admin-500'
                }`}>
                  {formatWaitTime(rider.waitingStartedAt, rider.rideFlowStatus, currentTime)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
