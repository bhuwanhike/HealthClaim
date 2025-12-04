import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FilePlus, 
  FileText, 
  FileSearch, 
  BarChart3, 
  Upload, 
  User,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NAVIGATION } from '../../utils/constants';

const iconMap = {
  LayoutDashboard,
  FilePlus,
  FileText,
  FileSearch,
  BarChart3,
  Upload,
  User,
};

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();
  
  const navigationItems = user ? NAVIGATION[user.role] : [];

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200 shadow-lg transition-all duration-300 z-40 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-md">
              <Activity className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg text-slate-900">HealthClaim</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-700">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              title={collapsed ? item.name : ''}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
