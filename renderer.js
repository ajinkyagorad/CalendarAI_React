// Simple renderer script for Electron
// This will be a basic setup without React for now
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  
  // Create a basic calendar UI
  root.innerHTML = `
    <div class="app-container dark">
      <div class="title-bar draggable">
        <div class="title">AI Gemini Calendar</div>
        <div class="controls non-draggable">
          <button id="settings-btn" aria-label="Settings">⚙️</button>
          <button id="minimize-btn" aria-label="Minimize">_</button>
          <button id="close-btn" aria-label="Close">✕</button>
        </div>
      </div>
      
      <div class="app-content">
        <div class="calendar">
          <div class="calendar-header">
            <h2>${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
            <div class="calendar-controls">
              <button id="prev-month">◀</button>
              <button id="today-btn">Today</button>
              <button id="next-month">▶</button>
            </div>
          </div>
          
          <div id="calendar-grid" class="calendar-grid">
            <!-- Calendar days will be generated here -->
          </div>
        </div>
        
        <div class="ai-assistant">
          <form id="ai-form" class="ai-input">
            <input type="text" placeholder="Ask about your calendar or add events..." />
            <button type="submit">📤</button>
          </form>
          <div id="ai-response" class="ai-response"></div>
        </div>
      </div>
    </div>
  `;
  
  // Add basic window control functionality
  document.getElementById('minimize-btn').addEventListener('click', () => {
    window.electron.minimizeApp();
  });
  
  document.getElementById('close-btn').addEventListener('click', () => {
    window.electron.closeApp();
  });
  
  // Generate calendar grid
  generateCalendarGrid();
  
  // Handle AI form submission
  document.getElementById('ai-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const query = input.value.trim();
    
    if (query) {
      document.getElementById('ai-response').textContent = `Processing: "${query}"...`;
      // In a real app, we would call the Gemini API here
      setTimeout(() => {
        document.getElementById('ai-response').textContent = `AI response to: "${query}" would appear here.`;
      }, 1000);
      input.value = '';
    }
  });
  
  // Calendar navigation
  document.getElementById('prev-month').addEventListener('click', () => {
    // In a real app, we would update the calendar view
    alert('Navigate to previous month');
  });
  
  document.getElementById('next-month').addEventListener('click', () => {
    // In a real app, we would update the calendar view
    alert('Navigate to next month');
  });
  
  document.getElementById('today-btn').addEventListener('click', () => {
    // In a real app, we would update the calendar view to today
    alert('Navigate to today');
  });
});

// Function to generate a simple calendar grid
function generateCalendarGrid() {
  const grid = document.getElementById('calendar-grid');
  
  // Add weekday headers
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekdays.forEach(day => {
    const dayEl = document.createElement('div');
    dayEl.className = 'weekday';
    dayEl.textContent = day;
    grid.appendChild(dayEl);
  });
  
  // Generate days for current month
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    if (i === today.getDate()) {
      dayEl.classList.add('today');
    }
    dayEl.textContent = i;
    grid.appendChild(dayEl);
    
    // Add click event
    dayEl.addEventListener('click', () => {
      // Remove selected class from all days
      document.querySelectorAll('.calendar-day').forEach(el => {
        el.classList.remove('selected');
      });
      // Add selected class to clicked day
      dayEl.classList.add('selected');
    });
  }
}
