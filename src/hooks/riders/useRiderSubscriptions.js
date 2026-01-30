import { useSubscription, gql } from '@apollo/client';
import { toast } from 'react-toastify';

/* ============================================
   GRAPHQL SUBSCRIPTION DEFINITIONS
   ============================================ */

const RIDER_UPDATES = gql`
  subscription RiderUpdates {
    riderUpdates {
      mutationType
    }
  }
`;

const RIDER_RIDE_FLOW_STATUS_UPDATES = gql`
  subscription RiderRideFlowStatusUpdates {
    riderRideFlowStatusUpdates {
      id
      name
      rideFlowStatus
    }
  }
`;

// NOTE: This subscription is for development/debugging. Consider removing in production.
const RIDER_LOGIN_STATUS_UPDATES = gql`
  subscription RiderLoginStatusUpdates {
    riderLoginStatusUpdates {
      id
      name
      isLoggedIn
    }
  }
`;

const RIDER_WAIT_TIME_UPDATES = gql`
  subscription RiderWaitTimeUpdates {
    riderWaitTimeUpdates {
      id
      waitingStartedAt
      rideFlowStatus
    }
  }
`;

/* ============================================
   SUBSCRIPTION HOOKS
   ============================================ */

/**
 * Subscribes to general rider updates (create, update, delete).
 * Triggers a refetch when riders change.
 *
 * @param {Object} options
 * @param {Function} options.onRiderUpdate - Callback when a rider changes
 * @param {boolean} options.showToasts - Whether to show toast notifications (default: true)
 */
export const useRiderUpdatesSubscription = ({
  onRiderUpdate,
  showToasts = true
}) => {
  const { data, loading, error } = useSubscription(RIDER_UPDATES, {
    onData: ({ data: { data } }) => {
      if (data?.riderUpdates) {
        const { mutationType } = data.riderUpdates;

        // Show toast notification
        if (showToasts) {
          switch (mutationType) {
            case 'CREATED':
              toast.success('New rider signed up', {
                position: 'bottom-right',
                autoClose: 3000,
              });
              break;
            case 'UPDATED':
              toast.info('Rider profile updated', {
                position: 'bottom-right',
                autoClose: 3000,
              });
              break;
            case 'DELETED':
              toast.info('Rider account deleted', {
                position: 'bottom-right',
                autoClose: 3000,
              });
              break;
            default:
              break;
          }
        }

        // Call the update callback if provided
        if (onRiderUpdate) {
          onRiderUpdate(mutationType);
        }
      }
    },
    onError: (err) => {
      console.error('Rider updates subscription error:', err);
    },
  });

  return {
    riderUpdatesData: data,
    riderUpdatesLoading: loading,
    riderUpdatesError: error,
  };
};

/**
 * Subscribes to rider ride flow status changes.
 * Updates in real-time when riders enter/exit ride flow states.
 *
 * @param {Object} options
 * @param {Function} options.onRideFlowUpdate - Callback when a rider's ride flow status changes
 * @param {boolean} options.showToasts - Whether to show toast notifications (default: true)
 */
export const useRiderRideFlowStatusSubscription = ({
  onRideFlowUpdate,
  showToasts = true
}) => {
  const { data, loading, error } = useSubscription(RIDER_RIDE_FLOW_STATUS_UPDATES, {
    onData: ({ data: { data } }) => {
      if (data?.riderRideFlowStatusUpdates) {
        const { id, name, rideFlowStatus } = data.riderRideFlowStatusUpdates;

        // Show toast notification
        if (showToasts) {
          switch (rideFlowStatus) {
            case 'WAITING':
              toast.info(`${name} is waiting for a ride`, {
                position: 'bottom-right',
                autoClose: 3000,
              });
              break;
            case 'IN_RIDE':
              toast.success(`${name} is now in a ride`, {
                position: 'bottom-right',
                autoClose: 3000,
              });
              break;
            case 'COMPLETED':
              toast.success(`${name} completed a ride`, {
                position: 'bottom-right',
                autoClose: 3000,
              });
              break;
            case 'NONE':
              toast.info(`${name} exited ride flow`, {
                position: 'bottom-right',
                autoClose: 3000,
              });
              break;
            default:
              break;
          }
        }

        // Call the update callback if provided
        if (onRideFlowUpdate) {
          onRideFlowUpdate(id, rideFlowStatus);
        }
      }
    },
    onError: (err) => {
      console.error('Rider ride flow status subscription error:', err);
    },
  });

  return {
    rideFlowData: data,
    rideFlowLoading: loading,
    rideFlowError: error,
  };
};

/**
 * NOTE: This subscription is for development/debugging. Consider removing in production.
 * Subscribes to rider login/logout status changes.
 * Updates in real-time when riders log in or out.
 *
 * @param {Object} options
 * @param {Function} options.onLoginStatusUpdate - Callback when a rider's login status changes
 * @param {boolean} options.showToasts - Whether to show toast notifications (default: true)
 */
export const useRiderLoginStatusSubscription = ({
  onLoginStatusUpdate,
  showToasts = true
}) => {
  const { data, loading, error } = useSubscription(RIDER_LOGIN_STATUS_UPDATES, {
    onData: ({ data: { data } }) => {
      if (data?.riderLoginStatusUpdates) {
        const { id, name, isLoggedIn } = data.riderLoginStatusUpdates;

        // Show toast notification
        if (showToasts) {
          if (isLoggedIn) {
            toast.success(`${name} logged in`, {
              position: 'bottom-right',
              autoClose: 3000,
            });
          } else {
            toast.info(`${name} logged out`, {
              position: 'bottom-right',
              autoClose: 3000,
            });
          }
        }

        // Call the update callback if provided
        if (onLoginStatusUpdate) {
          onLoginStatusUpdate(id, isLoggedIn);
        }
      }
    },
    onError: (err) => {
      console.error('Rider login status subscription error:', err);
    },
  });

  return {
    loginStatusData: data,
    loginStatusLoading: loading,
    loginStatusError: error,
  };
};

/**
 * Subscribes to rider wait time updates.
 * Updates in real-time when riders start or stop waiting for a ride.
 *
 * @param {Object} options
 * @param {Function} options.onWaitTimeUpdate - Callback when a rider's wait time changes
 */
export const useRiderWaitTimeSubscription = ({
  onWaitTimeUpdate,
}) => {
  const { data, loading, error } = useSubscription(RIDER_WAIT_TIME_UPDATES, {
    onData: ({ data: { data } }) => {
      if (data?.riderWaitTimeUpdates) {
        const { id, waitingStartedAt, rideFlowStatus } = data.riderWaitTimeUpdates;

        // Call the update callback if provided
        if (onWaitTimeUpdate) {
          onWaitTimeUpdate(id, waitingStartedAt, rideFlowStatus);
        }
      }
    },
    onError: (err) => {
      console.error('Rider wait time subscription error:', err);
    },
  });

  return {
    waitTimeData: data,
    waitTimeLoading: loading,
    waitTimeError: error,
  };
};
