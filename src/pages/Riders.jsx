import { useState, useMemo, useCallback } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { useGetAllRiders, useRiderUpdatesSubscription, useRiderRideFlowStatusSubscription, useRiderLoginStatusSubscription, useRiderWaitTimeSubscription } from '../hooks';
import { RiderTable, RiderFilters, RiderDetailModal } from '../components/riders';
import { SearchInput, Loading } from '../components/shared';

export default function Riders() {
  const { riders, loading, error, refetch } = useGetAllRiders();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedRider, setSelectedRider] = useState(null);

  // Handle real-time rider updates
  const handleRiderUpdate = useCallback(() => {
    // Refetch the rider list when riders change
    refetch();
  }, [refetch]);

  // Subscribe to rider updates
  useRiderUpdatesSubscription({
    onRiderUpdate: handleRiderUpdate,
    showToasts: true,
  });

  // Subscribe to ride flow status updates
  useRiderRideFlowStatusSubscription({
    onRideFlowUpdate: handleRiderUpdate,
    showToasts: true,
  });

  // NOTE: This subscription is for development/debugging. Consider removing in production.
  // Subscribe to login/logout status updates
  useRiderLoginStatusSubscription({
    onLoginStatusUpdate: handleRiderUpdate,
    showToasts: true,
  });

  // Subscribe to wait time updates
  useRiderWaitTimeSubscription({
    onWaitTimeUpdate: handleRiderUpdate,
  });

  // Filter and search riders
  const filteredRiders = useMemo(() => {
    return riders.filter((rider) => {
      // Apply status filter
      if (filter === 'logged-in' && !rider.isLoggedIn) return false;
      if (filter === 'logged-out' && rider.isLoggedIn) return false;
      if (filter === 'waiting' && rider.rideFlowStatus !== 'WAITING') return false;
      if (filter === 'in-ride' && rider.rideFlowStatus !== 'IN_RIDE') return false;
      if (filter === 'completed' && rider.rideFlowStatus !== 'COMPLETED') return false;

      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          rider.name?.toLowerCase().includes(query) ||
          rider.email?.toLowerCase().includes(query) ||
          rider.phoneNumber?.includes(query)
        );
      }

      return true;
    });
  }, [riders, filter, searchQuery]);

  const handleViewRider = (rider) => {
    setSelectedRider(rider);
  };

  const handleCloseModal = () => {
    setSelectedRider(null);
  };

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-600 mb-4">Error loading riders: {error.message}</p>
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
          <h1 className="text-2xl font-bold text-admin-900">Riders</h1>
          <p className="text-admin-500 mt-1">
            {filteredRiders.length} of {riders.length} riders
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
            placeholder="Search by name, email, or phone..."
          />
        </div>
        <RiderFilters filter={filter} onFilterChange={setFilter} />
      </div>

      {/* Content */}
      {loading && riders.length === 0 ? (
        <Loading message="Loading riders..." />
      ) : (
        <RiderTable riders={filteredRiders} onViewRider={handleViewRider} />
      )}

      {/* Rider Detail Modal */}
      {selectedRider && (
        <RiderDetailModal rider={selectedRider} onClose={handleCloseModal} refetchRiders={refetch} />
      )}
    </div>
  );
}
