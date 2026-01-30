import { FiX, FiMail, FiPhone, FiHome, FiCalendar, FiNavigation } from 'react-icons/fi';
import { StatusBadge } from '../shared';

export default function RiderDetailModal({ rider, onClose }) {
  if (!rider) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(parseInt(timestamp)).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-admin-200">
          <h2 className="text-xl font-semibold text-admin-900">Rider Details</h2>
          <button
            onClick={onClose}
            className="text-admin-400 hover:text-admin-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-arryde-rider/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-arryde-rider">
                {rider.name?.charAt(0)?.toUpperCase() || 'R'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-admin-900">{rider.name}</h3>
              <p className="text-admin-500">Rider ID: {rider.id}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge status={rider.isLoggedIn} type="login" />
                <StatusBadge status={rider.rideFlowStatus || 'NONE'} type="rideFlow" />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
              Contact Information
            </h4>
            <div className="flex items-center gap-3 text-admin-600">
              <FiMail size={18} />
              <a href={`mailto:${rider.email}`} className="hover:text-arryde-rider">
                {rider.email}
              </a>
            </div>
            <div className="flex items-center gap-3 text-admin-600">
              <FiPhone size={18} />
              <a href={`tel:${rider.phoneNumber}`} className="hover:text-arryde-rider">
                {rider.phoneNumber}
              </a>
            </div>
            {rider.homeAddress && (
              <div className="flex items-center gap-3 text-admin-600">
                <FiHome size={18} />
                <span>{rider.homeAddress}</span>
              </div>
            )}
          </div>

          {/* Ride Statistics */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
              Ride Statistics
            </h4>
            <div className="bg-admin-50 rounded-lg p-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-admin-900">
                  {rider.requestedRidesTotal || 0}
                </div>
                <div className="text-sm text-admin-500">Requested</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-admin-900">
                  {rider.acceptedRidesTotal || 0}
                </div>
                <div className="text-sm text-admin-500">Accepted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-arryde-rider">
                  {rider.completedRidesTotal || 0}
                </div>
                <div className="text-sm text-admin-500">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-admin-900">
                  {rider.expiredRidesTotal || 0}
                </div>
                <div className="text-sm text-admin-500">Expired</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {rider.canceledByRiderRidesTotal || 0}
                </div>
                <div className="text-sm text-admin-500">Canceled by Rider</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {rider.canceledByDriverRidesTotal || 0}
                </div>
                <div className="text-sm text-admin-500">Canceled by Driver</div>
              </div>
            </div>
          </div>

          {/* Current Ride Info */}
          {rider.currentRideId && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
                Current Ride
              </h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3 text-blue-700">
                  <FiNavigation size={18} />
                  <span className="font-medium">Ride ID: {rider.currentRideId}</span>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
              Account Info
            </h4>
            <div className="flex items-center gap-3 text-admin-600 text-sm">
              <FiCalendar size={16} />
              <span>Joined: {formatDate(rider.createdAt)}</span>
            </div>
            <div className="flex items-center gap-3 text-admin-600 text-sm">
              <FiCalendar size={16} />
              <span>Last Updated: {formatDate(rider.updatedAt)}</span>
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
