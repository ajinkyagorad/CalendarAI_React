import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Grid, 
  Badge,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth, 
  isSameDay, 
  isToday,
  getDay
} from 'date-fns';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';

// Import store
import useCalendarStore from '../store/useCalendarStore';

const CalendarView = ({ compact = false }) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get state and actions from store
  const { 
    selectedDate, 
    setSelectedDate,
    events,
    getEventsForDate
  } = useCalendarStore();
  
  // Navigation functions
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
  
  // Get the day of the week for the first day of the month (0 = Sunday, 6 = Saturday)
  const startDay = getDay(monthStart);
  
  // Create an array of empty cells for the days before the first day of the month
  const emptyDays = Array.from({ length: startDay }, (_, i) => i);
  
  // Check if a day has events
  const hasEvents = (day) => {
    return getEventsForDate(day).length > 0;
  };
  
  // Get number of events for a day
  const getEventCount = (day) => {
    return getEventsForDate(day).length;
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
    initial: { scale: 1 },
    hover: { scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={calendarVariants}
      style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <Box sx={{ p: compact ? 1 : 2, pb: compact ? 0.5 : 1 }}>
        {/* Calendar header with month/year and navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: compact ? 1 : 2 }}>
          <Typography variant={compact ? "subtitle2" : "h6"} fontWeight="medium">
            {format(currentDate, compact ? 'MMM yyyy' : 'MMMM yyyy')}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={goToPreviousMonth} aria-label="Previous month">
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            
            <IconButton size="small" onClick={goToToday} aria-label="Today">
              <TodayIcon fontSize="small" />
            </IconButton>
            
            <IconButton size="small" onClick={goToNextMonth} aria-label="Next month">
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        {/* Weekday headers */}
        <Grid container spacing={1}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Grid item xs={12/7} key={day}>
              <Typography 
                variant="caption" 
                align="center" 
                sx={{ 
                  display: 'block',
                  color: theme.palette.text.secondary,
                  fontWeight: 500
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Calendar grid */}
      <Box sx={{ px: 2, pb: 2, flex: 1, overflow: 'auto' }}>
        <Grid container spacing={1}>
          {/* Empty cells for days before the first of the month */}
          {emptyDays.map(index => (
            <Grid item xs={12/7} key={`empty-${index}`}>
              <Box 
                sx={{ 
                  aspectRatio: '1/1',
                  borderRadius: 1,
                  visibility: 'hidden'
                }}
              />
            </Grid>
          ))}
          
          {/* Actual days of the month */}
          {daysInMonth.map(day => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const eventCount = getEventCount(day);
            
            return (
              <Grid item xs={12/7} key={format(day, 'yyyy-MM-dd')}>
                <motion.div
                  variants={dayVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setSelectedDate(day)}
                >
                  <Box 
                    sx={{ 
                      aspectRatio: '1/1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      cursor: 'pointer',
                      position: 'relative',
                      border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
                      bgcolor: isToday(day) ? 'primary.main' : 'transparent',
                      color: isToday(day) ? 'primary.contrastText' : 'inherit',
                      '&:hover': {
                        bgcolor: isToday(day) ? 'primary.dark' : 'action.hover'
                      }
                    }}
                  >
                    {eventCount > 0 ? (
                      <Badge 
                        color="secondary" 
                        badgeContent={eventCount}
                        max={9}
                        sx={{
                          '& .MuiBadge-badge': {
                            right: 3,
                            top: 3,
                            fontSize: '0.65rem',
                            height: 16,
                            minWidth: 16
                          }
                        }}
                      >
                        <Typography variant="body2">
                          {format(day, 'd')}
                        </Typography>
                      </Badge>
                    ) : (
                      <Typography variant="body2">
                        {format(day, 'd')}
                      </Typography>
                    )}
                  </Box>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </motion.div>
  );
};

export default CalendarView;
