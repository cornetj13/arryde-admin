import { useSubscription, gql } from '@apollo/client';
import { toast } from 'react-toastify';

/* ============================================
   GRAPHQL SUBSCRIPTION DEFINITIONS
   ============================================ */

const DRIVER_DUTY_STATUS_UPDATES = gql`
  subscription DriverDutyStatusUpdates {
    driverDutyStatusUpdates {
      id
      isOnDuty
    }
  }
`;

const DRIVER_LOGIN_STATUS_UPDATES = gql`
  subscription DriverLoginStatusUpdates {
    driverLoginStatusUpdates {
      id
      isLoggedIn
    }
  }
`;

const DRIVER_AVAILABILITY_UPDATES = gql`
  subscription DriverAvailabilityUpdates {
    driverAvailabilityUpdates {
      id
      riderQueue
      driverNextAvailableAt
    }
  }
`;

/* ============================================
   SUBSCRIPTION HOOKS
   ============================================ */

/**
 * Subscribes to driver duty status changes.
 * Updates the driver list in real-time when drivers go on/off duty.
 *
 * @param {Object} options
 * @param {Array} options.drivers - Current list of drivers
 * @param {Function} options.onDriverUpdate - Callback when a driver's status changes
 * @param {boolean} options.showToasts - Whether to show toast notifications (default: true)
 */
export const useDriverDutyStatusSubscription = ({
  drivers = [],
  onDriverUpdate,
  showToasts = true
}) => {
  const { data, loading, error } = useSubscription(DRIVER_DUTY_STATUS_UPDATES, {
    onData: ({ data: { data } }) => {
      if (data?.driverDutyStatusUpdates) {
        const { id, isOnDuty } = data.driverDutyStatusUpdates;

        // Find the driver to get their name for the toast
        const driver = drivers.find((d) => d.id === id);
        const driverName = driver?.name || `Driver #${id}`;

        // Show toast notification
        if (showToasts) {
          if (isOnDuty) {
            toast.success(`${driverName} is now on duty`, {
              position: 'bottom-right',
              autoClose: 3000,
            });
          } else {
            toast.info(`${driverName} went off duty`, {
              position: 'bottom-right',
              autoClose: 3000,
            });
          }
        }

        // Call the update callback if provided
        if (onDriverUpdate) {
          onDriverUpdate(id, { isOnDuty });
        }
      }
    },
    onError: (err) => {
      console.error('Driver duty status subscription error:', err);
    },
  });

  return {
    dutyStatusData: data,
    dutyStatusLoading: loading,
    dutyStatusError: error,
  };
};

/**
 * Subscribes to driver login status changes.
 * Updates the driver list in real-time when drivers log in/out.
 *
 * @param {Object} options
 * @param {Array} options.drivers - Current list of drivers
 * @param {Function} options.onDriverUpdate - Callback when a driver's status changes
 * @param {boolean} options.showToasts - Whether to show toast notifications (default: true)
 */
export const useDriverLoginStatusSubscription = ({
  drivers = [],
  onDriverUpdate,
  showToasts = true
}) => {
  const { data, loading, error } = useSubscription(DRIVER_LOGIN_STATUS_UPDATES, {
    onData: ({ data: { data } }) => {
      if (data?.driverLoginStatusUpdates) {
        const { id, isLoggedIn } = data.driverLoginStatusUpdates;

        // Find the driver to get their name for the toast
        const driver = drivers.find((d) => d.id === id);
        const driverName = driver?.name || `Driver #${id}`;

        // Show toast notification
        if (showToasts) {
          if (isLoggedIn) {
            toast.success(`${driverName} logged in`, {
              position: 'bottom-right',
              autoClose: 3000,
            });
          } else {
            toast.info(`${driverName} logged out`, {
              position: 'bottom-right',
              autoClose: 3000,
            });
          }
        }

        // Call the update callback if provided
        if (onDriverUpdate) {
          onDriverUpdate(id, { isLoggedIn });
        }
      }
    },
    onError: (err) => {
      console.error('Driver login status subscription error:', err);
    },
  });

  return {
    loginStatusData: data,
    loginStatusLoading: loading,
    loginStatusError: error,
  };
};

/**
 * Subscribes to driver availability changes.
 * Updates the driver list in real-time when driver availability changes.
 *
 * @param {Object} options
 * @param {Array} options.drivers - Current list of drivers
 * @param {Function} options.onDriverUpdate - Callback when a driver's availability changes
 * @param {boolean} options.showToasts - Whether to show toast notifications (default: true)
 */
export const useDriverAvailabilitySubscription = ({
  drivers = [],
  onDriverUpdate,
  showToasts = true
}) => {
  const { data, loading, error } = useSubscription(DRIVER_AVAILABILITY_UPDATES, {
    onData: ({ data: { data } }) => {
      if (data?.driverAvailabilityUpdates) {
        const { id, riderQueue, driverNextAvailableAt } = data.driverAvailabilityUpdates;

        // Find the driver to get their name for the toast
        const driver = drivers.find((d) => d.id === id);
        const driverName = driver?.name || `Driver #${id}`;

        // Show toast notification
        if (showToasts) {
          toast.info(`${driverName}'s availability updated`, {
            position: 'bottom-right',
            autoClose: 3000,
          });
        }

        // Call the update callback if provided
        if (onDriverUpdate) {
          onDriverUpdate(id, { riderQueue, driverNextAvailableAt });
        }
      }
    },
    onError: (err) => {
      console.error('Driver availability subscription error:', err);
    },
  });

  return {
    availabilityData: data,
    availabilityLoading: loading,
    availabilityError: error,
  };
};
