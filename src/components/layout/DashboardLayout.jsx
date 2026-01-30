import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUIStore } from '../../stores';

export default function DashboardLayout() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-admin-50">
      <Sidebar />

      {/* Main content area */}
      <div className={`transition-all duration-200 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Header />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
