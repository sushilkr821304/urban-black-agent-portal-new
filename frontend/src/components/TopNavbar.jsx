import React from 'react';
import { Search, Wallet, ChevronDown, Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './TopNavbar.css';

const TopNavbar = ({ onToggleSidebar, isSidebarClosed }) => {
  const { user } = useAuth();
  const agentName = user?.agent?.name || 'Agent';

  return (
    <div className="top-navbar">
      <div className="top-nav-left">
        <button className="hamburger-btn" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>
        
        <div className="search-bar-container">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search for bookings, services..." className="nav-search-input" />
        </div>
      </div>

      <div className="top-nav-right">
        <div className="wallet-pill-v2">
          <div className="wallet-icon-bg">
            <Wallet size={18} />
          </div>
          <div className="wallet-details">
            <span className="w-label">Balance</span>
            <span className="w-amount">₹{user?.agent?.wallet?.balance?.toLocaleString() || '0'}</span>
          </div>
          <ChevronDown size={14} className="w-dropdown" />
        </div>

        <div className="notification-bell">
          <Bell size={22} />
          <span className="bell-badge"></span>
        </div>

        <div className="profile-section-v2">
          <div className="profile-info">
            <span className="profile-name">{agentName}</span>
            <span className="profile-role">Verified Agent</span>
          </div>
          <div className="profile-avatar-v2">
            <img src={`https://ui-avatars.com/api/?name=${agentName}&background=6C2BD9&color=fff`} alt="Profile" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
