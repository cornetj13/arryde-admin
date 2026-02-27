import { FiAlertTriangle, FiX } from 'react-icons/fi';

export default function ConfirmDeleteModal({
  entityType,
  entityName,
  onConfirm,
  onCancel,
  loading,
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />

      {/* Confirmation Dialog */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-admin-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <FiAlertTriangle size={20} className="text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-admin-900">
              Delete {entityType === 'driver' ? 'Driver' : 'Rider'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-admin-400 hover:text-admin-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-admin-600">
            Are you sure you want to permanently delete{' '}
            <span className="font-semibold text-admin-900">{entityName}</span>?
          </p>
          <p className="text-sm text-red-600 mt-2">
            This action cannot be undone. All associated data including ride history and favorites will be permanently removed.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-admin-200 bg-admin-50 rounded-b-xl">
          <button
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
