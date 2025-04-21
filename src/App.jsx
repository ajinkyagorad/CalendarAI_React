import React, { useState, useEffect } from 'react';
import { Box, Paper, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Components
import TitleBar from './components/TitleBar';
import CalendarView from './components/CalendarView';
import AIAssistant from './components/AIAssistant';
import SettingsPanel from './components/SettingsPanel';

// Stores
import useCalendarStore from './store/useCalendarStore';
import useAIStore from './store/useAIStore';

const App = () => {
  const theme = useTheme();
  const [transparency, setTransparency] = useState(0.85);
  const [showSettings, setShowSettings] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Initialize calendar with sample events on first load
  const generateSampleEvents = useCalendarStore(state => state.generateSampleEvents);
  
  useEffect(() => {
    // Check if this is the first time loading the app
    const isFirstLoad = !localStorage.getItem('app-initialized');
    if (isFirstLoad) {
      generateSampleEvents();
      localStorage.setItem('app-initialized', 'true');
    }
    
    // Set up global keyboard shortcut to toggle widget expansion
    const handleKeyDown = (e) => {
      if (e.altKey && e.code === 'Space') {
        setIsExpanded(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generateSampleEvents]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { 
      opacity: transparency,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };
  
  // Widget size variants
  const widgetVariants = {
    collapsed: {
      width: '320px',
      height: '400px',
      transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
    },
    expanded: {
      width: '350px',
      height: '500px',
      transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'transparent',
          overflow: 'hidden'
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          style={{ width: '100%', height: '100%' }}
        >
          <motion.div
            initial="collapsed"
            animate={isExpanded ? "expanded" : "collapsed"}
            variants={widgetVariants}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '320px',
              height: '400px',
            }}
          >
            <Paper
              elevation={4}
              sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                backdropFilter: 'blur(12px)',
                background: `rgba(${theme.palette.mode === 'dark' ? '18, 18, 18' : '255, 255, 255'}, ${transparency})`,
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <TitleBar 
                onSettingsClick={() => setShowSettings(!showSettings)} 
                onExpandClick={() => setIsExpanded(!isExpanded)}
                isExpanded={isExpanded}
              />
              
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden',
                p: isExpanded ? 1 : 0.5
              }}>
                <CalendarView compact={!isExpanded} />
                <AIAssistant compact={!isExpanded} />
              </Box>
              
              {showSettings && (
                <SettingsPanel
                  transparency={transparency}
                  setTransparency={setTransparency}
                  onClose={() => setShowSettings(false)}
                />
              )}
            </Paper>
          </motion.div>
        </motion.div>
      </Box>
    </LocalizationProvider>
  );
};

export default App;
