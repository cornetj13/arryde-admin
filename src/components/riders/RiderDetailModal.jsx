import { useState } from 'react';
import { FiX, FiMail, FiPhone, FiHome, FiCalendar, FiNavigation, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { StatusBadge, ConfirmDeleteModal } from '../shared';
import { useUpdateRider, useDeleteRider } from '../../hooks';

export default function RiderDetailModal({ rider, onClose, refetchRiders }) {
  if (!rider) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formValues, setFormValues] = useState({
    name: rider.name || '',
    email: rider.email || '',
    phoneNumber: rider.phoneNumber || '',
  });
  const [formErrors, setFormErrors] = useState({});

  const { updateRider, loadingUpdateRider } = useUpdateRider();
  const { deleteRider, loadingDeleteRider } = useDeleteRider();

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(parseInt(timestamp)).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
      await updateRider({
        variables: {
          id: rider.id,
          name: formValues.name.trim(),
          email: formValues.email.trim(),
          phoneNumber: formValues.phoneNumber.trim(),
        },
      });
      setIsEditing(false);
      setFormErrors({});
      if (refetchRiders) refetchRiders();
    } catch (err) {
      // Error toast handled by mutation hook
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRider({
        variables: { id: rider.id },
      });
      setShowDeleteConfirm(false);
      onClose();
      if (refetchRiders) refetchRiders();
    } catch (err) {
      // Error toast handled by mutation hook
    }
  };

  const handleCancelEdit = () => {
    setFormValues({
      name: rider.name || '',
      email: rider.email || '',
      phoneNumber: rider.phoneNumber || '',
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
          <h2 className="text-xl font-semibold text-admin-900">Rider Details</h2>
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
            <div className="w-20 h-20 rounded-full bg-arryde-rider/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-arryde-rider">
                {rider.name?.charAt(0)?.toUpperCase() || 'R'}
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
                <h3 className="text-lg font-semibold text-admin-900">{rider.name}</h3>
              )}
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
              </>
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
                  disabled={loadingUpdateRider}
                >
                  {loadingUpdateRider ? 'Saving...' : 'Save'}
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
          entityType="rider"
          entityName={rider.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          loading={loadingDeleteRider}
        />
      )}
    </div>
  );
}
