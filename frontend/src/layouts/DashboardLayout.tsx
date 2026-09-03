import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  AlertTriangle, 
  Trash2, 
  ShoppingCart, 
  BarChart3, 
  Lightbulb, 
  LogOut,
  Users as UsersIcon
} from 'lucide-react';

export function DashboardLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getNavigation = () => {
    if (!user) return [];

    const baseNav = [
      { name: 'Dashboard', to: '', icon: LayoutDashboard },
    ];

    if (user.role === 'ADMIN') {
      return [
        ...baseNav,
        { name: 'Users', to: 'users', icon: UsersIcon },
        { name: 'Inventory', to: 'inventory', icon: Package },
        { name: 'Waste', to: 'waste', icon: Trash2 },
        { name: 'Purchases', to: 'purchases', icon: ShoppingCart },
        { name: 'Analytics', to: 'analytics', icon: BarChart3 },
        { name: 'Recommendations', to: 'recommendations', icon: Lightbulb },
      ];
    }

    if (user.role === 'RESTAURANT_MANAGER') {
      return [
        ...baseNav,
        { name: 'Inventory', to: 'inventory', icon: Package },
        { name: 'Waste', to: 'waste', icon: Trash2 },
        { name: 'Purchases', to: 'purchases', icon: ShoppingCart },
        { name: 'Analytics', to: 'analytics', icon: BarChart3 },
        { name: 'Recommendations', to: 'recommendations', icon: Lightbulb },
      ];
    }

    if (user.role === 'STAFF') {
      return [
        ...baseNav,
        { name: 'Inventory', to: 'inventory', icon: Package },
        { name: 'Waste', to: 'waste', icon: Trash2 },
      ];
    }

    return [];
  };

  const navigation = getNavigation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 space-x-3">
          <img src="/logo.png" alt="ServeStock Logo" className="w-8 h-8 rounded-lg shadow-sm" />
          <h1 className="text-xl font-bold text-green-700 tracking-tight">ServeStock</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === ''}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-brand-50 text-brand-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-medium text-gray-800">Overview</h2>
          <div className="flex items-center">
            {/* Notifications or User Profile could go here */}
            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
