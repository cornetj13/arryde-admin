import { useQuery, gql } from '@apollo/client';

const GET_ALL_RIDES = gql`
  query GetAllRides($limit: Int, $offset: Int) {
    getAllRides(limit: $limit, offset: $offset) {
      id
      riderId
      riderName
      phoneNumber
      passengers
      pickUp
      dropOff
      pickUpTime
      date
      bidAmount
      requestedDriverIds
      driverId
      driverName
      isRequested
      isAccepted
      isCanceled
      isCompleted
      isExpired
      canceledAt
      completedAt
      expiredAt
      canceledBy
      createdAt
      updatedAt
    }
  }
`;

const GET_RIDE = gql`
  query GetRide($id: ID!) {
    getRide(id: $id) {
      id
      riderId
      riderName
      phoneNumber
      passengers
      pickUp
      dropOff
      pickUpTime
      date
      bidAmount
      waitingTime
      requestedDriverIds
      driverId
      driverName
      isRequested
      isAccepted
      isCanceled
      isCompleted
      isExpired
      canceledAt
      completedAt
      expiredAt
      canceledBy
      createdAt
      updatedAt
    }
  }
`;

// Fetches the newest rides first. `limit` keeps the unbounded rides table
// from degrading as history grows — pass a larger limit to load more.
export const useGetAllRides = (limit = 200) => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_RIDES, {
    variables: { limit, offset: 0 },
  });

  return {
    rides: data?.getAllRides || [],
    loading,
    error,
    refetch,
  };
};

export const useGetRide = (id) => {
  const { data, loading, error } = useQuery(GET_RIDE, {
    variables: { id },
    skip: !id,
  });

  return {
    ride: data?.getRide || null,
    loading,
    error,
  };
};
