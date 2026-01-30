import { useQuery, gql } from '@apollo/client';

const GET_ALL_DRIVERS = gql`
  query GetAllDrivers {
    getAllDrivers {
      id
      name
      email
      phoneNumber
      isOnDuty
      isLoggedIn
      driverNextAvailableAt
      licensePlate
      carMake
      carModel
      carColor
      acceptedRidesTotal
      completedRidesTotal
      createdAt
      updatedAt
    }
  }
`;

const GET_DRIVER = gql`
  query GetDriver($id: ID!) {
    getDriver(id: $id) {
      id
      name
      email
      phoneNumber
      isOnDuty
      isLoggedIn
      driverNextAvailableAt
      licensePlate
      carMake
      carModel
      carColor
      currentRideId
      riderQueue
      acceptedRidesTotal
      canceledByRiderRidesTotal
      canceledByDriverRidesTotal
      completedRidesTotal
      createdAt
      updatedAt
    }
  }
`;

const GET_DRIVER_RIDE_HISTORY = gql`
  query GetDriverRideHistory($id: ID!) {
    getDriverRideHistory(id: $id) {
      id
      pickUp
      dropOff
      bidAmount
      isAccepted
      isCompleted
      isCanceled
      createdAt
    }
  }
`;

export const useGetAllDrivers = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_DRIVERS);

  return {
    drivers: data?.getAllDrivers || [],
    loading,
    error,
    refetch,
  };
};

export const useGetDriver = (id) => {
  const { data, loading, error } = useQuery(GET_DRIVER, {
    variables: { id },
    skip: !id,
  });

  return {
    driver: data?.getDriver || null,
    loading,
    error,
  };
};

export const useGetDriverRideHistory = (id) => {
  const { data, loading, error } = useQuery(GET_DRIVER_RIDE_HISTORY, {
    variables: { id },
    skip: !id,
  });

  return {
    rideHistory: data?.getDriverRideHistory || [],
    loading,
    error,
  };
};
