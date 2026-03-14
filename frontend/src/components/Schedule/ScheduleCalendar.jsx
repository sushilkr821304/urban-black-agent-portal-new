import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './ScheduleCalendar.css';

const ScheduleCalendar = ({ trips, onDateClick }) => {
  const [date, setDate] = useState(new Date());

  // Function to get trip count for a specific date
  const getTripCountForDate = (viewDate) => {
    const dateStr = viewDate.toDateString();
    return trips.filter(trip => new Date(trip.tripDate).toDateString() === dateStr).length;
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const count = getTripCountForDate(date);
      if (count > 0) {
        return (
          <div className="trip-badge">
            {count} Trip{count > 1 ? 's' : ''}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        onChange={(val) => {
          setDate(val);
          onDateClick(val);
        }}
        value={date}
        tileContent={tileContent}
        className="premium-calendar"
      />
    </div>
  );
};

export default ScheduleCalendar;
