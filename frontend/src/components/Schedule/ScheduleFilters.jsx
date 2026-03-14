import React from 'react';

const ScheduleFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    'All Trips',
    'Today',
    'Upcoming',
    'In Progress',
    'Completed',
    'Cancelled'
  ];

  return (
    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            border: activeFilter === filter ? 'transparent' : '1px solid var(--border-color)',
            background: activeFilter === filter ? 'var(--primary)' : 'white',
            color: activeFilter === filter ? 'white' : 'var(--text-muted)',
            fontSize: '13px',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
            cursor: 'pointer',
            boxShadow: activeFilter === filter ? '0 4px 12px rgba(108, 43, 217, 0.2)' : 'none'
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default ScheduleFilters;
