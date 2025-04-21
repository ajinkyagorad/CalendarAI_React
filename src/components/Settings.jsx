import React from 'react';
import { motion } from 'framer-motion';

const Settings = ({ opacity, setOpacity, theme, setTheme, onClose }) => {
  // Handle window behavior settings
  const handleAlwaysOnTopChange = (e) => {
    window.electron.setAlwaysOnTop(e.target.checked);
  };
  
  const handleSkipTaskbarChange = (e) => {
    window.electron.setSkipTaskbar(e.target.checked);
  };
  
  // Animation variants
  const settingsVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.2 }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="settings-panel"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={settingsVariants}
    >
      <div className="settings-header">
        <h3>Settings</h3>
        <motion.button 
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </motion.button>
      </div>
      
      <div className="settings-group">
        <label htmlFor="opacity-slider">Transparency</label>
        <input 
          id="opacity-slider"
          type="range" 
          min="0.3" 
          max="1" 
          step="0.05" 
          value={opacity} 
          onChange={(e) => setOpacity(parseFloat(e.target.value))} 
        />
        <div className="opacity-value">{Math.round(opacity * 100)}%</div>
      </div>
      
      <div className="settings-group">
        <label>Theme</label>
        <div className="theme-toggle">
          <button 
            className={theme === 'light' ? 'active' : ''} 
            onClick={() => setTheme('light')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            Light
          </button>
          <button 
            className={theme === 'dark' ? 'active' : ''} 
            onClick={() => setTheme('dark')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            Dark
          </button>
        </div>
      </div>
      
      <div className="settings-group">
        <label>Window Behavior</label>
        <div className="checkbox-setting">
          <input 
            type="checkbox" 
            id="always-on-top" 
            onChange={handleAlwaysOnTopChange} 
          />
          <label htmlFor="always-on-top">Always on top</label>
        </div>
        <div className="checkbox-setting">
          <input 
            type="checkbox" 
            id="skip-taskbar" 
            onChange={handleSkipTaskbarChange} 
          />
          <label htmlFor="skip-taskbar">Hide from taskbar</label>
        </div>
      </div>
      
      <div className="settings-group">
        <div className="shortcut-info">
          <small>Tip: Press Alt+Space to quickly hide/show the calendar</small>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
