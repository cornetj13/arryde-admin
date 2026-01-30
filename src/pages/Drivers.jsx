import { useState, useMemo, useCallback } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import {
  useGetAllDrivers,
  useDriverDutyStatusSubscription,
  useDriverLoginStatusSubscription,
  useDriverAvailabilitySubscription
} from '../hooks';
import { DriverTable, DriverFilters, DriverDetailModal } from '../components/drivers';
import { SearchInput, Loading } from '../components/shared';

export default function Drivers() {
  const { drivers, loading, error, refetch } = useGetAllDrivers();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Handle real-time driver updates
  const handleDriverUpdate = useCallback(() => {
    // Refetch the driver list when a duty status changes
    refetch();
  }, [refetch]);

  // Subscribe to driver duty status changes
  useDriverDutyStatusSubscription({
    drivers,
    onDriverUpdate: handleDriverUpdate,
    showToasts: true,
  });

  // Subscribe to driver login status changes
  useDriverLoginStatusSubscription({
    drivers,
    onDriverUpdate: handleDriverUpdate,
    showToasts: true,
  });

  // Subscribe to driver availability changes
  useDriverAvailabilitySubscription({
    drivers,
    onDriverUpdate: handleDriverUpdate,
    showToasts: true,
  });

  // Filter and search drivers
  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      // Apply status filter
      if (filter === 'on-duty' && !driver.isOnDuty) return false;
      if (filter === 'off-duty' && driver.isOnDuty) return false;
      if (filter === 'logged-in' && !driver.isLoggedIn) return false;
      if (filter === 'logged-out' && driver.isLoggedIn) return false;

      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          driver.name?.toLowerCase().includes(query) ||
          driver.email?.toLowerCase().includes(query) ||
          driver.phoneNumber?.includes(query)
        );
      }

      return true;
    });
  }, [drivers, filter, searchQuery]);

  const handleViewDriver = (driver) => {
    setSelectedDriver(driver);
  };

  const handleCloseModal = () => {
    setSelectedDriver(null);
  };

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-red-600 mb-4">Error loading drivers: {error.message}</p>
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
          <h1 className="text-2xl font-bold text-admin-900">Drivers</h1>
          <p className="text-admin-500 mt-1">
            {filteredDrivers.length} of {drivers.length} drivers
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
        <DriverFilters filter={filter} onFilterChange={setFilter} />
      </div>

      {/* Content */}
      {loading && drivers.length === 0 ? (
        <Loading message="Loading drivers..." />
      ) : (
        <DriverTable drivers={filteredDrivers} onViewDriver={handleViewDriver} />
      )}

      {/* Driver Detail Modal */}
      {selectedDriver && (
        <DriverDetailModal driver={selectedDriver} onClose={handleCloseModal} />
      )}
    </div>
  );
}
