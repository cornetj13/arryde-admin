import { useQuery, gql } from '@apollo/client';

const GET_ALL_RIDERS = gql`
  query GetAllRiders {
    getAllRiders {
      id
      name
      email
      phoneNumber
      isLoggedIn
      rideFlowStatus
      waitingStartedAt
      currentRideId
      homeAddress
      requestedRidesTotal
      acceptedRidesTotal
      completedRidesTotal
      canceledByRiderRidesTotal
      canceledByDriverRidesTotal
      expiredRidesTotal
      createdAt
      updatedAt
    }
  }
`;

const GET_RIDER = gql`
  query GetRider($id: ID!) {
    getRider(id: $id) {
      id
      name
      email
      phoneNumber
      isLoggedIn
      rideFlowStatus
      currentRideId
      homeAddress
      requestedRidesTotal
      acceptedRidesTotal
      completedRidesTotal
      canceledByRiderRidesTotal
      canceledByDriverRidesTotal
      expiredRidesTotal
      createdAt
      updatedAt
      favoriteDriverIds
    }
  }
`;

const GET_RIDER_RIDE_HISTORY = gql`
  query GetRiderRideHistory($id: ID!) {
    getRiderRideHistory(id: $id) {
      id
      pickUp
      dropOff
      bidAmount
      isAccepted
      isCompleted
      isCanceled
      isExpired
      createdAt
    }
  }
`;

export const useGetAllRiders = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_RIDERS);

  return {
    riders: data?.getAllRiders || [],
    loading,
    error,
    refetch,
  };
};

export const useGetRider = (id) => {
  const { data, loading, error } = useQuery(GET_RIDER, {
    variables: { id },
    skip: !id,
  });

  return {
    rider: data?.getRider || null,
    loading,
    error,
  };
};

export const useGetRiderRideHistory = (id) => {
  const { data, loading, error } = useQuery(GET_RIDER_RIDE_HISTORY, {
    variables: { id },
    skip: !id,
  });

  return {
    rideHistory: data?.getRiderRideHistory || [],
    loading,
    error,
  };
};
