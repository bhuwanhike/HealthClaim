import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search / Breadcrumb can go here */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Welcome back, {user?.name.split(' ')[0]}!
          </h2>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
          </button>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            icon={LogOut}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
