import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAuthStore } from '../../stores';
import { useLogoutAdmin } from '../../hooks';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { admin } = useAuthStore();
  const { logout } = useLogoutAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-admin-200 flex items-center justify-between px-6">
      <div>
        {/* Breadcrumb or page title could go here */}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-admin-600">
          <FiUser size={18} />
          <span className="text-sm font-medium">{admin?.username || 'Admin'}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-admin-500 hover:text-admin-700 transition-colors"
        >
          <FiLogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </header>
  );
}
