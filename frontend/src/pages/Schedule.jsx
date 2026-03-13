import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Schedule = () => {
  const [view, setView] = useState('list'); // 'calendar' or 'list'

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Upcoming Schedule</h1>
          <p className="page-subtitle">Punctuality is premium. Here are your jobs for the week.</p>
        </div>
        <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '8px', padding: '4px' }}>
          <button 
            style={{ padding: '8px 16px', border: 'none', background: view === 'list' ? 'white' : 'transparent', borderRadius: '6px', fontSize: '14px', fontWeight: '500', boxShadow: view === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: view === 'list' ? 'var(--primary)' : 'var(--text-muted)' }}
            onClick={() => setView('list')}
          >
            List View
          </button>
          <button 
            style={{ padding: '8px 16px', border: 'none', background: view === 'calendar' ? 'white' : 'transparent', borderRadius: '6px', fontSize: '14px', fontWeight: '500', boxShadow: view === 'calendar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', color: view === 'calendar' ? 'var(--primary)' : 'var(--text-muted)' }}
            onClick={() => setView('calendar')}
          >
            Calendar
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="premium-card">
        {view === 'list' ? (
          <div>
            <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '16px' }}>March 2026</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white' }}>&larr; Prev</button>
                <button style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white' }}>Next &rarr;</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { date: '14', day: 'Wed', time: '10:00 AM - 11:30 AM', title: 'Airport Pickup - Terminal 2', cx: 'Rahul Sharma', cat: 'Luxury SUV' },
                { date: '15', day: 'Thu', time: '02:00 PM - 05:00 PM', title: 'City Tour - South Mumbai', cx: 'Priya Singh', cat: 'Premium Sedan' },
                { date: '17', day: 'Sat', time: '08:00 AM - 08:00 PM', title: 'Outstation - Lonavala', cx: 'Amit Kumar', cat: 'Luxury Van' }
              ].map((job, i) => (
                <div key={i} style={{ display: 'flex', gap: '24px' }}>
                  <div style={{ width: '80px', flexShrink: 0, textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>{job.day}</p>
                    <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)' }}>{job.date}</p>
                  </div>
                  
                  <div style={{ flex: 1, borderLeft: '4px solid var(--primary)', paddingLeft: '20px', paddingBottom: '24px', borderBottom: i === 2 ? 'none' : '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent)', padding: '2px 8px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px' }}>{job.time}</span>
                        <h3 style={{ margin: '12px 0 8px 0', fontSize: '18px' }}>{job.title}</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Passenger: <b>{job.cx}</b> • Service: <b>{job.cat}</b></p>
                      </div>
                      <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFB', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '48px', opacity: 0.5 }}>📅</span>
              <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>Calendar UI rendering here (e.g., using FullCalendar)...</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Schedule;
