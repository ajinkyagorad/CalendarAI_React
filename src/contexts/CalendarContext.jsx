import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const CalendarContext = createContext();

// Create a provider component
export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Load events from localStorage on initial render
  useEffect(() => {
    const storedEvents = localStorage.getItem('calendar-events');
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        // Convert date strings back to Date objects
        const eventsWithDates = parsedEvents.map(event => ({
          ...event,
          date: new Date(event.date)
        }));
        setEvents(eventsWithDates);
      } catch (error) {
        console.error('Error parsing stored events:', error);
      }
    }
  }, []);
  
  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);
  
  // Add a new event
  const addEvent = (newEvent) => {
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };
  
  // Update an existing event
  const updateEvent = (eventId, updatedEvent) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId ? { ...event, ...updatedEvent } : event
      )
    );
  };
  
  // Delete an event
  const deleteEvent = (eventId) => {
    setEvents(prevEvents => 
      prevEvents.filter(event => event.id !== eventId)
    );
  };
  
  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event => {
      return event.date.getDate() === date.getDate() &&
             event.date.getMonth() === date.getMonth() &&
             event.date.getFullYear() === date.getFullYear();
    });
  };
  
  // Context value
  const contextValue = {
    events,
    selectedDate,
    setSelectedDate,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate
  };
  
  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  );
};
