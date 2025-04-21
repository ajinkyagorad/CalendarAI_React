import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, format } from 'date-fns';

// Create a store for calendar state with persistence
const useCalendarStore = create(
  persist(
    (set, get) => ({
      // Current view state
      selectedDate: new Date(),
      viewMode: 'month', // 'month', 'week', 'day'
      
      // Events collection
      events: [],
      
      // Actions
      setSelectedDate: (date) => set({ selectedDate: date }),
      setViewMode: (mode) => set({ viewMode: mode }),
      
      // Event management
      addEvent: (event) => set((state) => ({ 
        events: [...state.events, { 
          id: Date.now().toString(),
          ...event 
        }] 
      })),
      
      updateEvent: (id, updatedEvent) => set((state) => ({
        events: state.events.map(event => 
          event.id === id ? { ...event, ...updatedEvent } : event
        )
      })),
      
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter(event => event.id !== id)
      })),
      
      // Utility functions
      getEventsForDate: (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return get().events.filter(event => 
          format(new Date(event.date), 'yyyy-MM-dd') === dateStr
        );
      },
      
      getUpcomingEvents: (count = 5) => {
        const today = new Date();
        return get().events
          .filter(event => new Date(event.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, count);
      },
      
      // Generate sample events for testing
      generateSampleEvents: () => {
        const today = new Date();
        const sampleEvents = [
          {
            id: '1',
            title: 'Team Meeting',
            date: today,
            time: '10:00',
            description: 'Weekly team sync',
            color: '#6366f1'
          },
          {
            id: '2',
            title: 'Project Deadline',
            date: addDays(today, 3),
            time: '18:00',
            description: 'Submit final deliverables',
            color: '#ec4899'
          },
          {
            id: '3',
            title: 'Lunch with Alex',
            date: addDays(today, 1),
            time: '12:30',
            description: 'Discuss partnership opportunities',
            color: '#10b981'
          }
        ];
        
        set({ events: sampleEvents });
      }
    }),
    {
      name: 'calendar-storage',
      partialize: (state) => ({ events: state.events }),
    }
  )
);

export default useCalendarStore;
