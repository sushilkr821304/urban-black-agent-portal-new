import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Wrench, 
  CalendarCheck, 
  Calendar, 
  CircleDollarSign, 
  Wallet, 
  History, 
  FileCheck, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { 
      name: 'Account', 
      icon: <ShieldCheck size={20} />, 
      isSubmenu: true, 
      subItems: [
        { name: 'KYC', icon: <FileCheck size={18} />, path: '/kyc' }
      ] 
    },
    { name: 'My Services', icon: <Wrench size={20} />, path: '/services' },
    { name: 'Bookings', icon: <CalendarCheck size={20} />, path: '/bookings/history' },
    { name: 'Schedule', icon: <Calendar size={20} />, path: '/schedule' },
    { name: 'Earnings', icon: <CircleDollarSign size={20} />, path: '/earnings' },
    { name: 'Wallet', icon: <Wallet size={20} />, path: '/wallet' },
    { name: 'Passbook', icon: <History size={20} />, path: '/passbook' },
  ];

  const bottomItems = [
    { name: 'My Profile', icon: <User size={20} />, path: '/profile' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo-full">
          <div className="logo-dot"></div>
          {isOpen && <span className="logo-label">Urban Black</span>}
        </div>
        <button className="toggle-btn" onClick={onToggle}>
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          item.isSubmenu ? (
            <div key={item.name} className={`submenu-wrapper ${accountOpen ? 'expanded' : ''}`}>
              <div 
                className={`nav-item ${currentPath.includes(item.path) ? 'active' : ''}`}
                onClick={() => setAccountOpen(!accountOpen)}
                style={{ cursor: 'pointer' }}
              >
                <span className="nav-icon">{item.icon}</span>
                {isOpen && <span className="nav-label">{item.name}</span>}
                {isOpen && <ChevronDown size={16} className={`chevron ${accountOpen ? 'rotate' : ''}`} />}
              </div>
              {accountOpen && item.subItems.map(sub => (
                <Link
                  key={sub.name}
                  to={sub.path}
                  className={`nav-item sub-item ${currentPath === sub.path ? 'active' : ''}`}
                  title={!isOpen ? sub.name : ''}
                >
                  <span className="nav-icon">{sub.icon}</span>
                  {isOpen && <span className="nav-label">{sub.name}</span>}
                </Link>
              ))}
            </div>
          ) : (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
              title={!isOpen ? item.name : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {isOpen && <span className="nav-label">{item.name}</span>}
            </Link>
          )
        ))}
      </nav>

      <div className="sidebar-footer">
        {bottomItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
            title={!isOpen ? item.name : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-label">{item.name}</span>}
          </Link>
        ))}
        <button className="nav-item logout" onClick={logout} title={!isOpen ? 'Logout' : ''}>
          <span className="nav-icon"><LogOut size={20} /></span>
          {isOpen && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
