import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({
    walletBalance: 24500,
    activeBookings: 3,
    completedTrips: 124,
    rating: 4.8
  });

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card" 
        style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
          color: 'white', 
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: 'white' }}>Welcome back, Agent! 👋</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>Here's what's happening with your business today.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button style={{ padding: '10px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', backdropFilter: 'blur(10px)', fontWeight: 'bold' }}>
            + Quick Action
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {[
          { label: 'Wallet Balance', value: `₹${stats.walletBalance.toLocaleString()}`, color: 'var(--primary)', icon: '💰' },
          { label: 'Active Bookings', value: stats.activeBookings, color: 'var(--accent)', icon: '🚗' },
          { label: 'Completed Trips', value: stats.completedTrips, color: '#10B981', icon: '✅' },
          { label: 'Average Rating', value: `${stats.rating} ⭐️`, color: '#F59E0B', icon: '📈' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px' }}>{stat.icon}</span>
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--text-muted)' }}>{stat.label}</h3>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>
        {/* Next/Active Bookings Widget */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="premium-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Active Jobs & Next Bookings</h2>
            <button style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: '600' }}>View All</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2].map((job, i) => (
              <div key={i} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ padding: '4px 8px', background: 'rgba(108, 43, 217, 0.1)', color: 'var(--primary)', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>IN PROGRESS</span>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>UB-BOOK-00{job}</span>
                  </div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '500' }}>Mumbai Airport Drop</p>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Today, 4:30 PM • SUV • Rahul Sharma</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)' }}>₹2,400</p>
                  <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Tracking</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Widget */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="premium-card">
          <h2 style={{ fontSize: '18px', margin: '0 0 24px 0' }}>Recent Activity</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { title: 'Payment Received', desc: '₹1,200 added to wallet for trip UB-BOOK-008', time: '2 hours ago', icon: '💸' },
              { title: 'New Review', desc: '5-star rating received from Amit Kumar', time: '5 hours ago', icon: '⭐️' },
              { title: 'KYC Verified', desc: 'Your documents have been approved.', time: '1 day ago', icon: '📄' }
            ].map((activity, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  {activity.icon}
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>{activity.title}</p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--text-muted)' }}>{activity.desc}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#9CA3AF' }}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
