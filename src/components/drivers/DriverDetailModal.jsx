import { FiX, FiMail, FiPhone, FiTruck, FiCalendar, FiClock } from 'react-icons/fi';
import { StatusBadge } from '../shared';

export default function DriverDetailModal({ driver, onClose }) {
  if (!driver) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(parseInt(timestamp)).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatNextAvailable = (timestamp) => {
    if (!timestamp) return 'Available Now';

    const now = Date.now();
    const availableTime = parseInt(timestamp);

    if (availableTime <= now) return 'Available Now';

    const diffMs = availableTime - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Available Now';
    if (diffMins < 60) return `In ${diffMins} minutes`;
    if (diffHours < 24) {
      const remainingMins = diffMins % 60;
      return remainingMins > 0
        ? `In ${diffHours} hours, ${remainingMins} minutes`
        : `In ${diffHours} hours`;
    }

    return new Date(availableTime).toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
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
          <h2 className="text-xl font-semibold text-admin-900">Driver Details</h2>
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
            <div className="w-20 h-20 rounded-full bg-arryde-driver/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-arryde-driver">
                {driver.name?.charAt(0)?.toUpperCase() || 'D'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-admin-900">{driver.name}</h3>
              <p className="text-admin-500">Driver ID: {driver.id}</p>
              <div className="mt-2 flex gap-2">
                <StatusBadge status={driver.isLoggedIn} type="login" />
                <StatusBadge status={driver.isOnDuty} type="duty" />
              </div>
            </div>
          </div>

          {/* Availability Info */}
          <div className="bg-admin-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FiClock size={18} className="text-admin-500" />
              <div>
                <span className="text-sm text-admin-500">Next Available:</span>
                <span className={`ml-2 font-medium ${
                  formatNextAvailable(driver.driverNextAvailableAt) === 'Available Now'
                    ? 'text-green-600'
                    : 'text-admin-900'
                }`}>
                  {formatNextAvailable(driver.driverNextAvailableAt)}
                </span>
              </div>
            </div>
            {driver.riderQueue > 0 && (
              <div className="mt-2 text-sm text-admin-600">
                Riders in queue: <span className="font-medium">{driver.riderQueue}</span>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
              Contact Information
            </h4>
            <div className="flex items-center gap-3 text-admin-600">
              <FiMail size={18} />
              <a href={`mailto:${driver.email}`} className="hover:text-arryde-driver">
                {driver.email}
              </a>
            </div>
            <div className="flex items-center gap-3 text-admin-600">
              <FiPhone size={18} />
              <a href={`tel:${driver.phoneNumber}`} className="hover:text-arryde-driver">
                {driver.phoneNumber}
              </a>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
              Vehicle Information
            </h4>
            {driver.carMake ? (
              <div className="bg-admin-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <FiTruck size={18} className="text-admin-500" />
                  <span className="font-medium text-admin-900">
                    {driver.carColor} {driver.carMake} {driver.carModel}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-admin-500">License Plate:</span>
                  <span className="ml-2 font-medium text-admin-900">
                    {driver.licensePlate || 'N/A'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-admin-400">No vehicle information available</p>
            )}
          </div>

          {/* Timestamps */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
              Account Info
            </h4>
            <div className="flex items-center gap-3 text-admin-600 text-sm">
              <FiCalendar size={16} />
              <span>Joined: {formatDate(driver.createdAt)}</span>
            </div>
            <div className="flex items-center gap-3 text-admin-600 text-sm">
              <FiCalendar size={16} />
              <span>Last Updated: {formatDate(driver.updatedAt)}</span>
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
