export default function StatusBadge({ status, type = 'default' }) {
  const getStatusClasses = () => {
    switch (type) {
      case 'duty':
        return status ? 'badge-success' : 'badge-warning';
      case 'login':
        return status ? 'badge-success' : 'badge-warning';
      case 'ride':
        return status ? 'badge-info' : 'badge bg-admin-100 text-admin-500';
      case 'rideFlow':
        // status is the rideFlowStatus string: NONE, WAITING, IN_RIDE, COMPLETED
        switch (status) {
          case 'WAITING':
            return 'badge-warning';
          case 'IN_RIDE':
            return 'badge-info';
          case 'COMPLETED':
            return 'badge-success';
          case 'NONE':
          default:
            return 'badge bg-admin-100 text-admin-500';
        }
      case 'rideStatus':
        // status is a computed ride status string: PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELED, EXPIRED
        switch (status) {
          case 'PENDING':
            return 'badge-warning';
          case 'ACCEPTED':
            return 'badge-info';
          case 'COMPLETED':
            return 'badge-success';
          case 'CANCELED':
            return 'badge-danger';
          case 'EXPIRED':
            return 'badge bg-admin-100 text-admin-500';
          default:
            return 'badge bg-admin-100 text-admin-500';
        }
      case 'driver':
        return 'badge-driver';
      case 'rider':
        return 'badge-rider';
      case 'success':
        return 'badge-success';
      case 'warning':
        return 'badge-warning';
      case 'danger':
        return 'badge-danger';
      case 'info':
        return 'badge-info';
      default:
        return 'badge bg-admin-100 text-admin-700';
    }
  };

  const getStatusText = () => {
    if (type === 'duty') {
      return status ? 'On Duty' : 'Off Duty';
    }
    if (type === 'login') {
      return status ? 'Logged In' : 'Logged Out';
    }
    if (type === 'ride') {
      return status ? 'In Ride' : 'No Active Ride';
    }
    if (type === 'rideFlow') {
      switch (status) {
        case 'WAITING':
          return 'Waiting for Ride';
        case 'IN_RIDE':
          return 'In Ride';
        case 'COMPLETED':
          return 'Completed Ride';
        case 'NONE':
        default:
          return 'No Current Ride';
      }
    }
    if (type === 'rideStatus') {
      switch (status) {
        case 'PENDING':
          return 'Pending';
        case 'ACCEPTED':
          return 'Accepted';
        case 'COMPLETED':
          return 'Completed';
        case 'CANCELED':
          return 'Canceled';
        case 'EXPIRED':
          return 'Expired';
        default:
          return status;
      }
    }
    return status;
  };

  return <span className={getStatusClasses()}>{getStatusText()}</span>;
}
