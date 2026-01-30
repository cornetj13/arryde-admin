import { useSubscription, gql } from '@apollo/client';
import { toast } from 'react-toastify';

/* ============================================
   GRAPHQL SUBSCRIPTION DEFINITIONS
   ============================================ */

const RIDE_STATUS_UPDATES = gql`
  subscription RideStatusUpdates {
    rideStatusUpdates {
      ride {
        id
        riderName
        driverName
        pickUp
        dropOff
        isRequested
        isAccepted
        isCanceled
        isCompleted
        isExpired
      }
      updateType
      canceledBy
    }
  }
`;

/* ============================================
   SUBSCRIPTION HOOKS
   ============================================ */

/**
 * Subscribes to all ride status changes (admin-friendly, no filtering).
 * Updates the ride list in real-time when rides are created, accepted, canceled, completed, or expired.
 *
 * @param {Object} options
 * @param {Function} options.onRideUpdate - Callback when a ride status changes
 * @param {boolean} options.showToasts - Whether to show toast notifications (default: true)
 */
export const useRideStatusSubscription = ({
  onRideUpdate,
  showToasts = true,
}) => {
  const { data, loading, error } = useSubscription(RIDE_STATUS_UPDATES, {
    onData: ({ data: { data } }) => {
      if (data?.rideStatusUpdates) {
        const { ride, updateType, canceledBy } = data.rideStatusUpdates;
        const rideName = `Ride #${ride.id}`;

        // Show toast notification
        if (showToasts) {
          switch (updateType) {
            case 'CREATED':
              toast.info(`${rideName}: ${ride.riderName} requested a ride`, {
                position: 'bottom-right',
                autoClose: 3000,
              });
              break;
            case 'ACCEPTED':
              toast.success(`${rideName}: Accepted by ${ride.driverName}`, {
                position: 'bottom-right',
                autoClose: 3000,
              });
              break;
            case 'CANCELED':
              toast.warn(`${rideName}: Canceled by ${canceledBy?.toLowerCase() || 'unknown'}`, {
                position: 'bottom-right',
                autoClose: 3000,
              });
              break;
            case 'COMPLETED':
              toast.success(`${rideName}: Completed`, {
                position: 'bottom-right',
                autoClose: 3000,
              });
              break;
            case 'EXPIRED':
              toast.info(`${rideName}: Expired`, {
                position: 'bottom-right',
                autoClose: 3000,
              });
              break;
          }
        }

        // Call the update callback if provided
        if (onRideUpdate) {
          onRideUpdate(ride.id, { updateType, canceledBy });
        }
      }
    },
    onError: (err) => {
      console.error('Ride status subscription error:', err);
    },
  });

  return {
    rideStatusData: data,
    rideStatusLoading: loading,
    rideStatusError: error,
  };
};
