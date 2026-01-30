import { FiEye, FiMapPin, FiUser, FiTruck } from 'react-icons/fi';
import { StatusBadge } from '../shared';

// Derive a single status string from the ride's boolean flags
const getRideStatus = (ride) => {
  if (ride.isCompleted) return 'COMPLETED';
  if (ride.isCanceled) return 'CANCELED';
  if (ride.isExpired) return 'EXPIRED';
  if (ride.isAccepted) return 'ACCEPTED';
  if (ride.isRequested) return 'PENDING';
  return 'UNKNOWN';
};

// Format a timestamp into a readable date/time string
const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(parseInt(timestamp));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

// Format bid amount as currency
const formatBid = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  return `$${amount}`;
};

export default function RideTable({ rides, onViewRide }) {
  if (rides.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-admin-500">No rides found</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="min-w-full divide-y divide-admin-200">
        <thead className="bg-admin-50">
          <tr>
            <th className="table-header">Ride</th>
            <th className="table-header">Route</th>
            <th className="table-header">Rider</th>
            <th className="table-header">Driver</th>
            <th className="table-header">Bid</th>
            <th className="table-header">Status</th>
            <th className="table-header">Created</th>
            <th className="table-header text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-admin-200">
          {rides.map((ride) => {
            const status = getRideStatus(ride);
            return (
              <tr key={ride.id} className="hover:bg-admin-50 transition-colors">
                <td className="table-cell">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-arryde-gold/10 flex items-center justify-center">
                        <FiMapPin className="text-arryde-gold" size={18} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-admin-900">Ride #{ride.id}</div>
                      <div className="text-sm text-admin-500">
                        {ride.passengers || 1} passenger{(ride.passengers || 1) !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="text-sm">
                    <div className="flex items-center gap-1 text-admin-700">
                      <span className="text-green-600 font-medium">From:</span>
                      <span className="truncate max-w-[150px]" title={ride.pickUp}>
                        {ride.pickUp}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-admin-500">
                      <span className="text-red-500 font-medium">To:</span>
                      <span className="truncate max-w-[150px]" title={ride.dropOff}>
                        {ride.dropOff}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-2 text-sm">
                    <FiUser size={14} className="text-arryde-rider" />
                    <span className="text-admin-700">{ride.riderName}</span>
                  </div>
                </td>
                <td className="table-cell">
                  {ride.driverName ? (
                    <div className="flex items-center gap-2 text-sm">
                      <FiTruck size={14} className="text-arryde-driver" />
                      <span className="text-admin-700">{ride.driverName}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-admin-400">Unassigned</span>
                  )}
                </td>
                <td className="table-cell">
                  <span className="text-sm font-medium text-arryde-gold">
                    {formatBid(ride.bidAmount)}
                  </span>
                </td>
                <td className="table-cell">
                  <StatusBadge status={status} type="rideStatus" />
                </td>
                <td className="table-cell">
                  <span className="text-sm text-admin-500">
                    {formatDateTime(ride.createdAt)}
                  </span>
                </td>
                <td className="table-cell text-right">
                  <button
                    onClick={() => onViewRide(ride)}
                    className="text-admin-500 hover:text-admin-700 p-2"
                    title="View details"
                  >
                    <FiEye size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
