import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

// Components
import ScheduleFilters from '../components/Schedule/ScheduleFilters';
import ScheduleSearchBar from '../components/Schedule/ScheduleSearchBar';
import ScheduleTable from '../components/Schedule/ScheduleTable';
import ScheduleCalendar from '../components/Schedule/ScheduleCalendar';
import TripDetailsModal from '../components/Schedule/TripDetailsModal';

const SchedulePage = () => {
  const [view, setView] = useState('list'); // 'calendar' or 'list'
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All Trips');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  // Modal
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = '/schedule';
      const params = {
        page: currentPage,
        size: pageSize
      };

      if (searchTerm) {
        endpoint = '/schedule/search';
        params.q = searchTerm;
      } else if (filter === 'Today') {
        endpoint = '/schedule/today';
      } else if (filter === 'Upcoming') {
        endpoint = '/schedule/upcoming';
      } else if (filter === 'Completed') {
        endpoint = '/schedule/completed';
      } else if (filter !== 'All Trips') {
        params.status = filter;
      }

      const { data } = await api.get(endpoint, { params });
      setTrips(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Error fetching schedule:', err);
      toast.error('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filter, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTrips();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchTrips]);

  const handleDateClick = async (date) => {
    setLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const { data } = await api.get('/schedule', {
        params: { date: dateStr, page: 0, size: 50 }
      });
      setTrips(data.content || []);
      setView('list'); // Switch to list view to see the results
    } catch (err) {
      toast.error('Error fetching trips for selected date');
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  return (
    <div className="page-container" style={{ maxWidth: '1400px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">Trip Schedule</h1>
          <p className="page-subtitle">Punctuality is premium. Monitor all your assigned trips and bookings.</p>
        </div>
        
        <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '12px', padding: '4px' }}>
          <button 
            onClick={() => setView('list')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: 'none', 
              background: view === 'list' ? 'white' : 'transparent', borderRadius: '8px', 
              fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              color: view === 'list' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: view === 'list' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            <LayoutGrid size={18} /> Table
          </button>
          <button 
            onClick={() => setView('calendar')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: 'none', 
              background: view === 'calendar' ? 'white' : 'transparent', borderRadius: '8px', 
              fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              color: view === 'calendar' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: view === 'calendar' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            <CalendarIcon size={18} /> Calendar
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="premium-card" style={{ padding: '0' }}>
        
        {/* Filters & Search Toolbar */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <ScheduleFilters activeFilter={filter} onFilterChange={(f) => { setFilter(f); setCurrentPage(0); }} />
          <ScheduleSearchBar value={searchTerm} onChange={(v) => { setSearchTerm(v); setCurrentPage(0); }} />
        </div>

        {/* Dynamic Content */}
        {view === 'list' ? (
          <>
            <ScheduleTable trips={trips} loading={loading} onView={openDetails} />
            
            {/* Pagination Footer */}
            {totalPages > 0 && (
              <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', background: '#F8F9FC' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Showing Page {currentPage + 1} of {totalPages}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="pagination-btn" 
                    disabled={currentPage === 0} 
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <ChevronLeft size={18} /> Previous
                  </button>
                  <button 
                    className="pagination-btn" 
                    disabled={currentPage >= totalPages - 1} 
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Next <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <ScheduleCalendar trips={trips} onDateClick={handleDateClick} />
        )}
      </motion.div>

      {/* Trip Details Modal */}
      <TripDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        trip={selectedTrip} 
      />

      <style>{`
        .pagination-btn {
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          background: white;
          font-size: 13px;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .pagination-btn:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--primary);
          background: #F5F3FF;
        }
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default SchedulePage;
