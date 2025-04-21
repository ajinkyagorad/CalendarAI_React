import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your key
const GEMINI_API_KEY = 'AIzaSyBiUCOL9_5cV26oJQ46O26YPkxpPwMFLHY';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Process a user query with Gemini AI
 * @param {string} query - The user's query
 * @param {Array} events - Current calendar events
 * @param {Date} selectedDate - Currently selected date in the calendar
 * @returns {Promise<Object>} - The AI response
 */
export const processAIQuery = async (query, events, selectedDate) => {
  try {
    // Create a context for the AI with calendar information
    const currentEvents = events.map(event => 
      `${event.title} on ${new Date(event.date).toLocaleDateString()} at ${event.time}`
    ).join('\n');
    
    const selectedDateStr = selectedDate ? selectedDate.toLocaleDateString() : 'today';
    
    const prompt = `
      You are an AI calendar assistant. Today is ${new Date().toLocaleDateString()}.
      The user has selected ${selectedDateStr} in their calendar.
      
      Current events in the calendar:
      ${currentEvents || 'No events scheduled yet.'}
      
      User query: ${query}
      
      If the user is trying to add an event, extract the event details (title, date, time) and respond in a JSON format like:
      {"action": "add_event", "title": "Event title", "date": "YYYY-MM-DD", "time": "HH:MM", "description": "Event description"}
      
      Otherwise, provide a helpful response about their calendar or query.
    `;
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Check if the response is a JSON for adding an event
    try {
      const jsonResponse = JSON.parse(text);
      return jsonResponse;
    } catch (e) {
      // Not a JSON response, just return the text
      return { action: 'response', text };
    }
  } catch (error) {
    console.error('Error with AI response:', error);
    return { 
      action: 'error', 
      text: 'Sorry, I had trouble processing that request. Please try again.' 
    };
  }
};

/**
 * Get AI suggestions for time management
 * @param {Array} events - Current calendar events
 * @returns {Promise<string>} - AI suggestions
 */
export const getAISuggestions = async (events) => {
  try {
    const currentEvents = events.map(event => 
      `${event.title} on ${new Date(event.date).toLocaleDateString()} at ${event.time}`
    ).join('\n');
    
    const prompt = `
      You are an AI calendar assistant helping with time management.
      Today is ${new Date().toLocaleDateString()}.
      
      Current events in the calendar:
      ${currentEvents || 'No events scheduled yet.'}
      
      Based on this schedule, provide a short, helpful suggestion for better time management or productivity.
      Keep your response under 100 words and focus on practical advice.
    `;
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return 'I couldn\'t generate suggestions right now. Please try again later.';
  }
};
