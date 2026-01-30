import { useState, useMemo, useCallback } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { useGetAllRides, useRideStatusSubscription } from '../hooks';
import { RideTable, RideFilters, RideDetailModal } from '../components/rides';
import { SearchInput, Loading } from '../components/shared';

// Derive a single status string from ride's boolean flags (matches RideTable logic)
const getRideStatus = (ride) => {
  if (ride.isCompleted) return 'COMPLETED';
  if (ride.isCanceled) return 'CANCELED';
  if (ride.isExpired) return 'EXPIRED';
  if (ride.isAccepted) return 'ACCEPTED';
  if (ride.isRequested) return 'PENDING';
  return 'UNKNOWN';
};

export default function Rides() {
  const { rides, loading, error, refetch } = useGetAllRides();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedRide, setSelectedRide] = useState(null);

  // Handle real-time ride updates
  const handleRideUpdate = useCallback(() => {
    refetch();
  }, [refetch]);

  // Subscribe to ride status updates
  useRideStatusSubscription({
    onRideUpdate: handleRideUpdate,
    showToasts: true,
  });

  // Filter and search rides
  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      // Apply status filter
      const status = getRideStatus(ride);
      if (filter === 'pending' && status !== 'PENDING') return false;
      if (filter === 'accepted' && status !== 'ACCEPTED') return false;
      if (filter === 'completed' && status !== 'COMPLETED') return false;
      if (filter === 'canceled' && status !== 'CANCELED') return false;
      if (filter === 'expired' && status !== 'EXPIRED') return false;

      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          ride.riderName?.toLowerCase().includes(query) ||
          ride.driverName?.toLowerCase().includes(query) ||
          ride.pickUp?.toLowerCase().includes(query) ||
          ride.dropOff?.toLowerCase().includes(query) ||
          ride.phoneNumber?.includes(query) ||
          ride.id?.toString().includes(query)
        );
      }

      return true;
    });
  }, [rides, filter, searchQuery]);

  const handleViewRide = (ride) => {
    setSelectedRide(ride);
  };

  const handleCloseModal = () => {
    setSelectedRide(null);
  };

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-600 mb-4">Error loading rides: {error.message}</p>
        <button onClick={() => refetch()} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-900">Rides</h1>
          <p className="text-admin-500 mt-1">
            {filteredRides.length} of {rides.length} rides
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="btn-secondary flex items-center gap-2"
          disabled={loading}
        >
          <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by rider, driver, location, or ride ID..."
          />
        </div>
        <RideFilters filter={filter} onFilterChange={setFilter} />
      </div>

      {/* Content */}
      {loading && rides.length === 0 ? (
        <Loading message="Loading rides..." />
      ) : (
        <RideTable rides={filteredRides} onViewRide={handleViewRide} />
      )}

      {/* Ride Detail Modal */}
      {selectedRide && (
        <RideDetailModal ride={selectedRide} onClose={handleCloseModal} />
      )}
    </div>
  );
}
