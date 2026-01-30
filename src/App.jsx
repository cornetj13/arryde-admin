import { Routes, Route, Navigate } from 'react-router-dom';
import { Login, RequireAuth } from './components/auth';
import { DashboardLayout } from './components/layout';
import { Dashboard, Drivers, Riders, Rides, Analytics } from './pages';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/riders" element={<Riders />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Route>

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-admin-900 mb-2">404</h1>
        <p className="text-admin-500">Page not found</p>
      </div>
    </div>
  );
}

export default App;
