import { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { useRefreshToken } from '../../hooks';

export default function RequireAuth() {
  const { isAuth } = useAuthStore();
  const location = useLocation();
  const { refresh } = useRefreshToken();

  // On first mount with a persisted session, verify it by refreshing the
  // access token (the persisted one is almost certainly expired — it only
  // lives 10 minutes). Without this, the dashboard shell rendered and then
  // every query failed. refresh() clears auth on failure, which routes to
  // /login below.
  const [verifying, setVerifying] = useState(isAuth);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    if (!isAuth) {
      setVerifying(false);
      return;
    }

    (async () => {
      await refresh();
      setVerifying(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-admin-900" />
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
