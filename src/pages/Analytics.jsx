import { FiBarChart2, FiTrendingUp, FiMapPin, FiStar } from 'react-icons/fi';

export default function Analytics() {
  const plannedFeatures = [
    {
      icon: FiBarChart2,
      title: 'Rides Per Day/Week',
      description: 'Track ride volume over time with interactive charts.',
    },
    {
      icon: FiTrendingUp,
      title: 'Driver Performance',
      description: 'View metrics like completion rate, average rating, and ride counts per driver.',
    },
    {
      icon: FiMapPin,
      title: 'Popular Locations',
      description: 'See the most common pickup and dropoff locations across all rides.',
    },
    {
      icon: FiStar,
      title: 'Active Drivers Over Time',
      description: 'Monitor driver availability trends and peak activity periods.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-admin-900">Analytics</h1>
        <p className="text-admin-500 mt-1">Insights and metrics for the Arryde platform</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <FiBarChart2 className="text-blue-600" size={32} />
        </div>
        <h2 className="text-xl font-semibold text-blue-900 mb-2">Analytics Coming Soon</h2>
        <p className="text-blue-700 max-w-md mx-auto">
          We're building analytics and reporting tools to give you deeper insights
          into the Arryde platform. Here's what's planned:
        </p>
      </div>

      {/* Planned Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plannedFeatures.map((feature) => (
          <div key={feature.title} className="card p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-admin-100 flex-shrink-0">
                <feature.icon className="text-admin-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-admin-900">{feature.title}</h3>
                <p className="text-sm text-admin-500 mt-1">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
