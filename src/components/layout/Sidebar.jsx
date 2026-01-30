import { NavLink } from 'react-router-dom';
import { FiUsers, FiUserCheck, FiNavigation, FiBarChart2, FiHome, FiMenu, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useUIStore } from '../../stores';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/drivers', label: 'Drivers', icon: FiUserCheck },
  { to: '/riders', label: 'Riders', icon: FiUsers },
  { to: '/rides', label: 'Rides', icon: FiNavigation },
  { to: '/analytics', label: 'Analytics', icon: FiBarChart2 },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden btn-secondary p-2"
      >
        <FiMenu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-admin-900 text-white transform transition-all duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center h-16 border-b border-admin-700 ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : 'px-6'}`}>
            <span className={`text-xl font-bold ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Arryde Admin</span>
            <span className={`text-xl font-bold ${sidebarCollapsed ? 'hidden lg:block' : 'hidden'}`}>A</span>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 py-6 space-y-1 ${sidebarCollapsed ? 'lg:px-2' : 'px-4'}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.disabled ? '#' : item.to}
                onClick={(e) => {
                  if (item.disabled) e.preventDefault();
                  // Close mobile sidebar on nav
                  if (sidebarOpen) toggleSidebar();
                }}
                title={sidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center py-3 rounded-lg transition-colors ${
                    sidebarCollapsed ? 'lg:justify-center lg:px-2' : 'px-4'
                  } ${
                    item.disabled
                      ? 'text-admin-600 cursor-not-allowed'
                      : isActive
                      ? 'bg-admin-700 text-white'
                      : 'text-admin-300 hover:bg-admin-800 hover:text-white'
                  }`
                }
              >
                <item.icon className={sidebarCollapsed ? 'lg:mr-0' : 'mr-3'} size={20} />
                <span className={sidebarCollapsed ? 'lg:hidden' : ''}>{item.label}</span>
                {item.disabled && !sidebarCollapsed && (
                  <span className="ml-auto text-xs bg-admin-700 px-2 py-0.5 rounded lg:block hidden">
                    Soon
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Collapse toggle button (desktop only) */}
          <div className="hidden lg:flex justify-center py-2 border-t border-admin-700">
            <button
              onClick={toggleSidebarCollapsed}
              className="p-2 rounded-lg text-admin-400 hover:text-white hover:bg-admin-800 transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
            </button>
          </div>

          {/* Footer */}
          <div className={`py-4 border-t border-admin-700 ${sidebarCollapsed ? 'lg:px-2 lg:text-center' : 'px-6'}`}>
            <p className={`text-xs text-admin-500 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>Arryde Admin Dashboard</p>
            <p className={`text-xs text-admin-600 ${sidebarCollapsed ? 'hidden' : ''}`}>v0.1.0 MVP</p>
            <p className={`text-xs text-admin-600 ${sidebarCollapsed ? 'hidden lg:block' : 'hidden'}`}>v0.1</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
