import { create } from 'zustand';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Support both online and offline modes
// Get API key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Initialize the Gemini API with error handling
let genAI = null;
let model = null;

// Function to test API connectivity
const testApiConnectivity = async () => {
  if (!genAI || !model) return false;
  
  try {
    // Simple test query to check if API is responsive
    const result = await model.generateContent('Hello');
    return result && result.response;
  } catch (error) {
    console.error('API connectivity test failed:', error);
    return false;
  }
};

// Initialize the API only if we have an API key
if (GEMINI_API_KEY && GEMINI_API_KEY.length > 0 && GEMINI_API_KEY !== 'your_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log('Gemini API initialized successfully');
    
    // Test connectivity in the background
    testApiConnectivity().then(isConnected => {
      console.log('Gemini API connectivity test result:', isConnected ? 'Connected' : 'Disconnected');
    });
  } catch (error) {
    console.error('Failed to initialize Gemini API:', error);
    // Will operate in offline mode
  }
} else {
  console.log('No API key provided. Running in offline mode only.');
  // Will operate in offline mode only
}

// Helper functions for offline mode
const extractEventDetails = (query) => {
  // Simple event detection for offline mode
  const addEventRegex = /add|create|schedule|set up|new event|remind me/i;
  const dateRegex = /(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i;
  const timeRegex = /(\d{1,2}:\d{2}|\d{1,2} ?[ap]m|noon|midnight)/i;
  
  // Extract potential event details from the query
  const title = query.replace(addEventRegex, '').replace(dateRegex, '').replace(timeRegex, '').trim();
  const dateMatch = query.match(dateRegex);
  const timeMatch = query.match(timeRegex);
  
  // Get current date as fallback
  const today = new Date();
  let eventDate = today.toISOString().split('T')[0]; // Default to today
  let eventTime = '12:00'; // Default time
  
  if (dateMatch) {
    if (dateMatch[0].toLowerCase() === 'today') {
      eventDate = today.toISOString().split('T')[0];
    } else if (dateMatch[0].toLowerCase() === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      eventDate = tomorrow.toISOString().split('T')[0];
    } else if (/monday|tuesday|wednesday|thursday|friday|saturday|sunday/i.test(dateMatch[0])) {
      // Handle day of week
      const dayMap = {
        'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
        'friday': 5, 'saturday': 6, 'sunday': 0
      };
      const targetDay = dayMap[dateMatch[0].toLowerCase()];
      const today = new Date();
      const currentDay = today.getDay();
      let daysToAdd = targetDay - currentDay;
      if (daysToAdd <= 0) daysToAdd += 7; // Next week if today or already passed
      
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + daysToAdd);
      eventDate = targetDate.toISOString().split('T')[0];
    }
  }
  
  if (timeMatch) {
    eventTime = timeMatch[0];
  }
  
  return {
    title: title || 'New Event',
    date: eventDate,
    time: eventTime,
    description: 'Created in offline mode'
  };
};

const useAIStore = create((set, get) => ({
  // State
  isProcessing: false,
  lastQuery: '',
  lastResponse: '',
  history: [],
  isOnlineMode: model !== null, // Track whether we're using online or offline mode
  error: null,
  
  // Actions
  processQuery: async (query, calendarEvents, selectedDate) => {
    set({ isProcessing: true, lastQuery: query, error: null });
    
    try {
      // Format events for context (used in response generation)
      const eventsContext = calendarEvents.length > 0
        ? calendarEvents.map(event => 
            `- ${event.title} on ${new Date(event.date).toLocaleDateString()} at ${event.time}`
          ).join('\n')
        : 'No events scheduled yet.';
      
      // Check if query is about adding an event
      const addEventRegex = /add|create|schedule|set up|new event|remind me/i;
      const listEventsRegex = /list|show|display|what|events|schedule|calendar/i;
      
      let responseText;
      let isOfflineMode = false;
      
      // Try to use the Gemini API first if available
      if (model) {
        try {
          // Create the prompt with calendar context
          const prompt = `
            You are an AI calendar assistant. Today is ${new Date().toLocaleDateString()}.
            The user has selected ${selectedDate.toLocaleDateString()} in their calendar.
            
            Current events in the calendar:
            ${eventsContext}
            
            User query: ${query}
            
            If the user is trying to add an event, extract the event details (title, date, time) and respond in a JSON format like:
            {"action": "add_event", "title": "Event title", "date": "YYYY-MM-DD", "time": "HH:MM", "description": "Event description"}
            
            Otherwise, provide a helpful response about their calendar or query.
          `;
          
          // Call the Gemini API
          const result = await model.generateContent(prompt);
          responseText = result.response.text();
          console.log('Using online Gemini API mode');
          
          // Successfully used online mode
          set({ isOnlineMode: true });
        } catch (apiError) {
          console.error('API Error, falling back to offline mode:', apiError);
          isOfflineMode = true;
          set({ isOnlineMode: false });
        }
      } else {
        console.log('Gemini API not available, using offline mode');
        isOfflineMode = true;
        set({ isOnlineMode: false });
      }
      
      // If online mode failed or is not available, use offline mode
      if (isOfflineMode) {
        if (addEventRegex.test(query)) {
          // Extract event details and create event
          const eventDetails = extractEventDetails(query);
          responseText = JSON.stringify({
            action: 'add_event',
            title: eventDetails.title,
            date: eventDetails.date,
            time: eventDetails.time,
            description: eventDetails.description || 'Created in offline mode'
          });
        } else if (listEventsRegex.test(query)) {
          // Respond with list of events
          if (calendarEvents.length === 0) {
            responseText = "You don't have any events scheduled yet. Would you like to add one?";
          } else {
            responseText = `Here are your upcoming events:\n${eventsContext}`;
          }
        } else {
          // Generic helpful responses
          const responses = [
            "I can help you manage your calendar. Try asking me to add an event or show your schedule.",
            "I'm your calendar assistant. You can ask me to add events like 'add meeting tomorrow at 3pm'.",
            "Need help with your schedule? I can add events or show you what's coming up.",
            `Today is ${new Date().toLocaleDateString()}. You have ${calendarEvents.length} events in your calendar.`,
            "I'm currently in offline mode, but I can still help with basic calendar management."
          ];
          
          // Pick a response based on query content or randomly
          const randomIndex = Math.floor(Math.random() * responses.length);
          responseText = responses[randomIndex];
        }
      }
      
      // Check if the response is a JSON for adding an event
      try {
        const jsonResponse = JSON.parse(responseText);
        set({ 
          lastResponse: responseText,
          history: [...get().history, { query, response: responseText, timestamp: new Date() }],
          isProcessing: false
        });
        return jsonResponse;
      } catch (e) {
        // Not a JSON response, just return the text
        set({ 
          lastResponse: responseText,
          history: [...get().history, { query, response: responseText, timestamp: new Date() }],
          isProcessing: false
        });
        return { action: 'response', text: responseText };
      }
    } catch (error) {
      console.error('Error processing query:', error);
      set({ 
        error: 'Something went wrong. Please try again.',
        isProcessing: false
      });
      return { action: 'response', text: 'Sorry, I encountered an error. Please try again.' };
    }
  },
  
  clearHistory: () => set({ history: [] }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null })
}));

export default useAIStore;
