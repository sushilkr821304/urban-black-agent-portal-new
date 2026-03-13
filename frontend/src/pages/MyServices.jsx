import React from 'react';
import { motion } from 'framer-motion';

const services = [
  { id: 1, title: 'Cab Booking', icon: '🚗', desc: 'Local and intercity cab services for your clients.', active: true },
  { id: 2, title: 'Airport Transfer', icon: '✈️', desc: 'Premium airport pick & drop facilities.', active: true },
  { id: 3, title: 'Rental', icon: '💼', desc: 'Hourly rentals for business executives and tours.', active: false },
  { id: 4, title: 'Outstation', icon: '🛣️', desc: 'Long distance outstation trips with pro drivers.', active: false },
];

const MyServices = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Services</h1>
        <p className="page-subtitle">Manage and view all services you provide to clients.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {services.map((service, i) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="premium-card"
            style={{ 
              display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden'
            }}
          >
            {service.active && (
              <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(108, 43, 217, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                Active
              </div>
            )}
            <div style={{ fontSize: '40px' }}>{service.icon}</div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: 'var(--text-main)' }}>{service.title}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>{service.desc}</p>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <button className={service.active ? 'btn-outline' : 'btn-primary'} style={{ width: '100%' }}>
                {service.active ? 'Manage Service' : 'Activate Service'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyServices;
