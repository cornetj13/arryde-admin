import { FiUsers, FiUserCheck, FiNavigation } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useGetAllDrivers, useGetAllRiders, useGetAllRides } from '../hooks';

export default function Dashboard() {
  const { drivers, loading: driversLoading } = useGetAllDrivers();
  const { riders, loading: ridersLoading } = useGetAllRiders();
  const { rides, loading: ridesLoading } = useGetAllRides();

  const stats = [
    {
      label: 'Drivers',
      value: driversLoading ? '...' : drivers.length,
      icon: FiUserCheck,
      color: 'arryde-driver',
      link: '/drivers',
    },
    {
      label: 'Riders',
      value: ridersLoading ? '...' : riders.length,
      icon: FiUsers,
      color: 'arryde-rider',
      link: '/riders',
    },
    {
      label: 'Rides',
      value: ridesLoading ? '...' : rides.length,
      icon: FiNavigation,
      color: 'arryde-gold',
      link: '/rides',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-admin-900">Dashboard</h1>
        <p className="text-admin-500 mt-1">Welcome to the Arryde Admin Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-admin-500">{stat.label}</p>
                <p className="text-3xl font-bold text-admin-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}/10`}>
                <stat.icon className={`text-${stat.color}`} size={24} />
              </div>
            </div>
            <Link
              to={stat.link}
              className="mt-4 inline-block text-sm text-admin-600 hover:text-admin-900"
            >
              View all →
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-admin-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/drivers" className="btn-primary">
            View Drivers
          </Link>
          <Link to="/riders" className="btn-secondary">
            View Riders
          </Link>
          <Link to="/rides" className="btn-secondary">
            View Rides
          </Link>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900">Coming Soon: Analytics</h3>
        <p className="text-sm text-blue-700 mt-1">
          Analytics and insights are coming soon — including rides per day/week charts,
          driver performance metrics, popular locations, and more.
        </p>
      </div>
    </div>
  );
}
