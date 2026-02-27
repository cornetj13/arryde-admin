import { gql, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

/* ============================================
   GRAPHQL MUTATION DEFINITIONS
   ============================================ */

const UPDATE_DRIVER = gql`
  mutation UpdateDriver(
    $id: ID!
    $email: EmailAddress
    $name: String
    $phoneNumber: String
    $carMake: String
    $carModel: String
  ) {
    updateDriver(
      id: $id
      email: $email
      name: $name
      phoneNumber: $phoneNumber
      carMake: $carMake
      carModel: $carModel
    ) {
      id
      name
      email
      phoneNumber
      licensePlate
      carMake
      carModel
      carColor
      isOnDuty
      isLoggedIn
      driverNextAvailableAt
      riderQueue
      acceptedRidesTotal
      completedRidesTotal
      createdAt
      updatedAt
    }
  }
`;

const DELETE_DRIVER = gql`
  mutation DeleteDriver($id: ID!) {
    deleteDriver(id: $id) {
      message
    }
  }
`;

/* ============================================
   MUTATION HOOKS
   ============================================ */

export const useUpdateDriver = () => {
  const [updateDriver, { loading: loadingUpdateDriver, error: errorUpdateDriver }] =
    useMutation(UPDATE_DRIVER, {
      onError: (error) => {
        console.error('Update Driver Error:', error);
        toast.error(`Failed to update driver: ${error.message}`, {
          position: 'bottom-right',
          autoClose: 4000,
        });
      },
      onCompleted: () => {
        toast.success('Driver updated successfully', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      },
    });

  return { updateDriver, loadingUpdateDriver, errorUpdateDriver };
};

export const useDeleteDriver = () => {
  const [deleteDriver, { loading: loadingDeleteDriver, error: errorDeleteDriver }] =
    useMutation(DELETE_DRIVER, {
      onError: (error) => {
        console.error('Delete Driver Error:', error);
        toast.error(`Failed to delete driver: ${error.message}`, {
          position: 'bottom-right',
          autoClose: 4000,
        });
      },
      onCompleted: () => {
        toast.success('Driver deleted successfully', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      },
    });

  return { deleteDriver, loadingDeleteDriver, errorDeleteDriver };
};
