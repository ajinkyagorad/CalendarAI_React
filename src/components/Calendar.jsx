import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { CalendarContext } from '../contexts/CalendarContext';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { events, selectedDate, setSelectedDate } = useContext(CalendarContext);
  
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };
  
  // Generate days for the current month view
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Add padding days to start from Sunday
  const dayOfWeek = monthStart.getDay();
  const paddingDaysBefore = Array(dayOfWeek).fill(null);
  
  // Check if a day has events
  const hasEvents = (day) => {
    return events.some(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day.getDate() && 
             eventDate.getMonth() === day.getMonth() && 
             eventDate.getFullYear() === day.getFullYear();
    });
  };
  
  // Animation variants
  const calendarVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const dayVariants = {
    hover: { scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.15)' },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="calendar"
      initial="hidden"
      animate="visible"
      variants={calendarVariants}
    >
      <div className="calendar-header">
        <h2>{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="calendar-controls">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToToday}
            aria-label="Today"
            className="today-button"
          >
            Today
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </motion.button>
        </div>
      </div>
      
      <div className="weekday-header">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {/* Padding days */}
        {paddingDaysBefore.map((_, index) => (
          <div key={`padding-before-${index}`} className="calendar-day padding" />
        ))}
        
        {/* Actual days */}
        {daysInMonth.map(day => {
          const isSelected = selectedDate && 
            day.getDate() === selectedDate.getDate() && 
            day.getMonth() === selectedDate.getMonth() && 
            day.getFullYear() === selectedDate.getFullYear();
            
          return (
            <motion.div
              key={day.toString()}
              className={`calendar-day ${isToday(day) ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEvents(day) ? 'has-events' : ''}`}
              onClick={() => setSelectedDate(day)}
              whileHover="hover"
              whileTap="tap"
              variants={dayVariants}
            >
              <span className="day-number">{format(day, 'd')}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Calendar;
