import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

/* ============================================
   GRAPHQL MUTATION DEFINITIONS
   ============================================ */

const UPDATE_RIDER = gql`
  mutation UpdateRider(
    $id: ID!
    $email: EmailAddress
    $name: String
    $phoneNumber: String
  ) {
    updateRider(
      id: $id
      email: $email
      name: $name
      phoneNumber: $phoneNumber
    ) {
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

const DELETE_RIDER = gql`
  mutation DeleteRider($id: ID!) {
    deleteRider(id: $id) {
      message
    }
  }
`;

/* ============================================
   MUTATION HOOKS
   ============================================ */

export const useUpdateRider = () => {
  const [updateRider, { loading: loadingUpdateRider, error: errorUpdateRider }] =
    useMutation(UPDATE_RIDER, {
      onError: (error) => {
        console.error('Update Rider Error:', error);
        toast.error(`Failed to update rider: ${error.message}`, {
          position: 'bottom-right',
          autoClose: 4000,
        });
      },
      onCompleted: () => {
        toast.success('Rider updated successfully', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      },
    });

  return { updateRider, loadingUpdateRider, errorUpdateRider };
};

export const useDeleteRider = () => {
  const [deleteRider, { loading: loadingDeleteRider, error: errorDeleteRider }] =
    useMutation(DELETE_RIDER, {
      onError: (error) => {
        console.error('Delete Rider Error:', error);
        toast.error(`Failed to delete rider: ${error.message}`, {
          position: 'bottom-right',
          autoClose: 4000,
        });
      },
      onCompleted: () => {
        toast.success('Rider deleted successfully', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      },
    });

  return { deleteRider, loadingDeleteRider, errorDeleteRider };
};
