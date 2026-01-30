import { FiX, FiMapPin, FiUser, FiTruck, FiPhone, FiCalendar, FiClock, FiUsers, FiDollarSign } from 'react-icons/fi';
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

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(parseInt(timestamp)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(parseInt(timestamp)).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function RideDetailModal({ ride, onClose }) {
  if (!ride) return null;

  const status = getRideStatus(ride);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-admin-200">
          <h2 className="text-xl font-semibold text-admin-900">Ride Details</h2>
          <button
            onClick={onClose}
            className="text-admin-400 hover:text-admin-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Ride ID & Status */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-arryde-gold/10 flex items-center justify-center">
              <FiMapPin className="text-arryde-gold" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-admin-900">Ride #{ride.id}</h3>
              <p className="text-admin-500">
                {ride.passengers || 1} passenger{(ride.passengers || 1) !== 1 ? 's' : ''}
              </p>
              <div className="mt-2">
                <StatusBadge status={status} type="rideStatus" />
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
              Route
            </h4>
            <div className="bg-admin-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                </div>
                <div>
                  <div className="text-xs text-admin-500 font-medium">Pick Up</div>
                  <div className="text-admin-900">{ride.pickUp}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-600" />
                </div>
                <div>
                  <div className="text-xs text-admin-500 font-medium">Drop Off</div>
                  <div className="text-admin-900">{ride.dropOff}</div>
                </div>
              </div>
            </div>
          </div>

          {/* People */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
              People
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-admin-600">
                <FiUser size={18} className="text-arryde-rider" />
                <div>
                  <span className="text-admin-900 font-medium">{ride.riderName}</span>
                  {ride.riderId && (
                    <span className="text-admin-500 ml-2 text-sm">(ID: {ride.riderId})</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-admin-600">
                <FiPhone size={18} />
                <a href={`tel:${ride.phoneNumber}`} className="hover:text-arryde-driver">
                  {ride.phoneNumber}
                </a>
              </div>
              <div className="flex items-center gap-3 text-admin-600">
                <FiTruck size={18} className="text-arryde-driver" />
                {ride.driverName ? (
                  <div>
                    <span className="text-admin-900 font-medium">{ride.driverName}</span>
                    {ride.driverId && (
                      <span className="text-admin-500 ml-2 text-sm">(ID: {ride.driverId})</span>
                    )}
                  </div>
                ) : (
                  <span className="text-admin-400">No driver assigned</span>
                )}
              </div>
            </div>
          </div>

          {/* Ride Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
              Ride Info
            </h4>
            <div className="bg-admin-50 rounded-lg p-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <FiDollarSign size={16} className="text-arryde-gold" />
                <div>
                  <div className="text-lg font-bold text-admin-900">
                    ${ride.bidAmount || 0}
                  </div>
                  <div className="text-xs text-admin-500">Bid Amount</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers size={16} className="text-admin-500" />
                <div>
                  <div className="text-lg font-bold text-admin-900">
                    {ride.passengers || 1}
                  </div>
                  <div className="text-xs text-admin-500">Passengers</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiClock size={16} className="text-admin-500" />
                <div>
                  <div className="text-sm font-medium text-admin-900">
                    {ride.pickUpTime}
                  </div>
                  <div className="text-xs text-admin-500">Pick Up Time</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar size={16} className="text-admin-500" />
                <div>
                  <div className="text-sm font-medium text-admin-900">
                    {formatDate(ride.date)}
                  </div>
                  <div className="text-xs text-admin-500">Date</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cancellation Info */}
          {ride.isCanceled && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
                Cancellation
              </h4>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-red-700 font-medium">
                  Canceled by: {ride.canceledBy || 'Unknown'}
                </div>
                {ride.canceledAt && (
                  <div className="text-red-600 text-sm mt-1">
                    {formatDateTime(ride.canceledAt)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Completion Info */}
          {ride.isCompleted && ride.completedAt && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
                Completion
              </h4>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-green-700 text-sm">
                  Completed: {formatDateTime(ride.completedAt)}
                </div>
              </div>
            </div>
          )}

          {/* Expiration Info */}
          {ride.isExpired && ride.expiredAt && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
                Expiration
              </h4>
              <div className="bg-admin-50 rounded-lg p-4">
                <div className="text-admin-600 text-sm">
                  Expired: {formatDateTime(ride.expiredAt)}
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
              Timeline
            </h4>
            <div className="flex items-center gap-3 text-admin-600 text-sm">
              <FiCalendar size={16} />
              <span>Created: {formatDateTime(ride.createdAt)}</span>
            </div>
            <div className="flex items-center gap-3 text-admin-600 text-sm">
              <FiCalendar size={16} />
              <span>Last Updated: {formatDateTime(ride.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-admin-200 bg-admin-50">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
