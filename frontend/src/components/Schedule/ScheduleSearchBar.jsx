import React from 'react';
import { Search } from 'lucide-react';

const ScheduleSearchBar = ({ value, onChange }) => {
  return (
    <div style={{ position: 'relative', minWidth: '320px', flex: 1 }}>
      <Search size={18} style={{ position: 'absolute', left: '16px', top: '13px', color: '#94a3b8' }} />
      <input
        type="text"
        placeholder="Search trips by booking ID, customer, or driver..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '12px 16px 12px 48px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          width: '100%',
          fontSize: '14px',
          background: '#F8F9FC'
        }}
      />
    </div>
  );
};

export default ScheduleSearchBar;
