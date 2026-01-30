import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores';

export default function RequireAuth() {
  const { isAuth } = useAuthStore();
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
