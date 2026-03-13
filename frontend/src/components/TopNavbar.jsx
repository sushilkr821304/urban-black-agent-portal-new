import React, { useState, useRef, useEffect } from 'react';
import { Search, Wallet, ChevronDown, Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import './TopNavbar.css';

const TopNavbar = ({ onToggleSidebar, isSidebarClosed }) => {
  const { user, logout } = useAuth();
  const { balance } = useWallet();

  const mobileNumber = user?.phoneNumber || user?.username || 'N/A';

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
            <span className="w-amount">₹{balance?.toLocaleString() || '0'}</span>
          </div>
          <ChevronDown size={14} className="w-dropdown" />
        </div>

        <div className="notification-bell">
          <Bell size={22} />
          <span className="bell-badge"></span>
        </div>

        <div className="simple-profile-section">
          <div className="nav-profile-avatar">
            {user?.agent?.profilePhoto ? (
              <img 
                src={user.agent.profilePhoto.startsWith('http') ? user.agent.profilePhoto : `http://localhost:8080/${user.agent.profilePhoto}`} 
                alt="Profile" 
              />
            ) : (
              <span className="avatar-initials">
                {user?.agent?.name?.charAt(0) || mobileNumber.charAt(0) || 'A'}
              </span>
            )}
          </div>
          <div className="nav-profile-info">
            <span className="agent-mobile-number">{mobileNumber}</span>
            <button className="minimal-logout-btn" onClick={logout}>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
