import { useState } from 'react';
import { FiX, FiMail, FiPhone, FiTruck, FiCalendar, FiClock, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { StatusBadge, ConfirmDeleteModal } from '../shared';
import { useUpdateDriver, useDeleteDriver } from '../../hooks';

export default function DriverDetailModal({ driver, onClose, refetchDrivers }) {
  if (!driver) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formValues, setFormValues] = useState({
    name: driver.name || '',
    email: driver.email || '',
    phoneNumber: driver.phoneNumber || '',
    carMake: driver.carMake || '',
    carModel: driver.carModel || '',
  });
  const [formErrors, setFormErrors] = useState({});

  const { updateDriver, loadingUpdateDriver } = useUpdateDriver();
  const { deleteDriver, loadingDeleteDriver } = useDeleteDriver();

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

  const validateForm = () => {
    const errors = {};
    if (!formValues.name || formValues.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!formValues.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      errors.email = 'Valid email is required';
    }
    if (!formValues.phoneNumber || !/^\(\d{3}\) \d{3}-\d{4}$/.test(formValues.phoneNumber)) {
      errors.phoneNumber = 'Format: (360) 555-1234';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateDriver({
        variables: {
          id: driver.id,
          name: formValues.name.trim(),
          email: formValues.email.trim(),
          phoneNumber: formValues.phoneNumber.trim(),
          carMake: formValues.carMake.trim() || null,
          carModel: formValues.carModel.trim() || null,
        },
      });
      setIsEditing(false);
      setFormErrors({});
      if (refetchDrivers) refetchDrivers();
    } catch (err) {
      // Error toast handled by mutation hook
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDriver({
        variables: { id: driver.id },
      });
      setShowDeleteConfirm(false);
      onClose();
      if (refetchDrivers) refetchDrivers();
    } catch (err) {
      // Error toast handled by mutation hook
    }
  };

  const handleCancelEdit = () => {
    setFormValues({
      name: driver.name || '',
      email: driver.email || '',
      phoneNumber: driver.phoneNumber || '',
      carMake: driver.carMake || '',
      carModel: driver.carModel || '',
    });
    setFormErrors({});
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={isEditing ? undefined : onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-admin-200">
          <h2 className="text-xl font-semibold text-admin-900">Driver Details</h2>
          <button
            onClick={isEditing ? handleCancelEdit : onClose}
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
            <div className="flex-1">
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    value={formValues.name}
                    onChange={(e) => setFormValues(prev => ({ ...prev, name: e.target.value }))}
                    className={`input text-lg font-semibold ${formErrors.name ? 'input-error' : ''}`}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                  )}
                </div>
              ) : (
                <h3 className="text-lg font-semibold text-admin-900">{driver.name}</h3>
              )}
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
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="label">Email</label>
                  <div className="flex items-center gap-3">
                    <FiMail size={18} className="text-admin-400 flex-shrink-0" />
                    <input
                      type="email"
                      value={formValues.email}
                      onChange={(e) => setFormValues(prev => ({ ...prev, email: e.target.value }))}
                      className={`input ${formErrors.email ? 'input-error' : ''}`}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1 ml-7">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="label">Phone</label>
                  <div className="flex items-center gap-3">
                    <FiPhone size={18} className="text-admin-400 flex-shrink-0" />
                    <input
                      type="tel"
                      value={formValues.phoneNumber}
                      onChange={(e) => setFormValues(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className={`input ${formErrors.phoneNumber ? 'input-error' : ''}`}
                      placeholder="(360) 555-1234"
                    />
                  </div>
                  {formErrors.phoneNumber && (
                    <p className="text-xs text-red-500 mt-1 ml-7">{formErrors.phoneNumber}</p>
                  )}
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Vehicle Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-admin-700 uppercase tracking-wider">
              Vehicle Information
            </h4>
            {isEditing ? (
              <div className="bg-admin-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <FiTruck size={18} className="text-admin-500 flex-shrink-0" />
                  <span className="text-sm text-admin-500">
                    {driver.carColor || 'No color'} &middot; Plate: {driver.licensePlate || 'N/A'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Make</label>
                    <input
                      type="text"
                      value={formValues.carMake}
                      onChange={(e) => setFormValues(prev => ({ ...prev, carMake: e.target.value }))}
                      className="input"
                      placeholder="e.g. Lincoln"
                    />
                  </div>
                  <div>
                    <label className="label">Model</label>
                    <input
                      type="text"
                      value={formValues.carModel}
                      onChange={(e) => setFormValues(prev => ({ ...prev, carModel: e.target.value }))}
                      className="input"
                      placeholder="e.g. Aviator"
                    />
                  </div>
                </div>
              </div>
            ) : driver.carMake ? (
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
        <div className="flex justify-between gap-3 p-6 border-t border-admin-200 bg-admin-50">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-danger flex items-center gap-2"
            disabled={isEditing}
          >
            <FiTrash2 size={16} />
            Delete
          </button>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button onClick={handleCancelEdit} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-blue"
                  disabled={loadingUpdateDriver}
                >
                  {loadingUpdateDriver ? 'Saving...' : 'Save'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-blue flex items-center gap-2"
              >
                <FiEdit2 size={16} />
                Edit
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          entityType="driver"
          entityName={driver.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          loading={loadingDeleteDriver}
        />
      )}
    </div>
  );
}
