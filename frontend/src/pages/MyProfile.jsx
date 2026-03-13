import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account settings and preferences.</p>
      </div>

      <div className="premium-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: '#FAFAFB' }}>
          <button 
            style={{ padding: '16px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'details' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'details' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'details' ? '600' : '500' }}
            onClick={() => setActiveTab('details')}
          >
            Agent Details
          </button>
          <button 
            style={{ padding: '16px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'security' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'security' ? '600' : '500' }}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>

        <div style={{ padding: '32px' }}>
          {activeTab === 'details' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '32px', fontWeight: 'bold' }}>
                  A
                </div>
                <div>
                  <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>Upload New Photo</button>
                  <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>JPG or PNG, max 5MB.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Full Name</label>
                  <input type="text" defaultValue="Agent Smith" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Phone Number</label>
                  <input type="text" defaultValue="+91 9876543210" disabled style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#F3F4F6' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Email Address</label>
                  <input type="email" defaultValue="agent@example.com" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                </div>
              </div>
              
              <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-primary">Save Changes</button>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Current Password</label>
                  <input type="password" placeholder="Enter current password" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>New Password</label>
                  <input type="password" placeholder="Enter new password" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                </div>
              </div>
              
              <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-primary">Update Password</button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
