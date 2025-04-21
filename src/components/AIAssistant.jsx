import React, { useState, useRef } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Typography, 
  Paper,
  CircularProgress,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';

// Import stores
import useCalendarStore from '../store/useCalendarStore';
import useAIStore from '../store/useAIStore';

const AIAssistant = ({ compact = false }) => {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  
  // Get state and actions from stores
  const { 
    selectedDate, 
    events,
    addEvent 
  } = useCalendarStore();
  
  const { 
    isProcessing, 
    lastResponse, 
    processQuery 
  } = useAIStore();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, delay: 0.2 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isProcessing) return;
    
    // Process the query using the AI store
    const result = await processQuery(input.trim(), events, selectedDate);
    
    // Handle the result based on the action
    if (result.action === 'add_event') {
      addEvent({
        title: result.title,
        date: new Date(result.date),
        time: result.time,
        description: result.description || '',
        color: theme.palette.primary.main
      });
    }
    
    // Clear the input
    setInput('');
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Paper 
        elevation={0}
        sx={{
          p: compact ? 1 : 2,
          mt: compact ? 0.5 : 1,
          mx: compact ? 1 : 2,
          mb: compact ? 1 : 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: compact ? 0.75 : 1.5 }}>
          <SmartToyIcon color="primary" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="subtitle2" fontWeight="medium" fontSize={compact ? '0.75rem' : '0.875rem'}>
            AI Assistant
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your calendar or add events..."
              disabled={isProcessing}
              inputRef={inputRef}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'background.default',
                }
              }}
            />
            
            <motion.div
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <IconButton 
                color="primary"
                type="submit"
                disabled={isProcessing || !input.trim()}
                aria-label="Send"
                edge="end"
              >
                {isProcessing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <SendIcon />
                )}
              </IconButton>
            </motion.div>
          </Box>
        </form>
        
        {lastResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box 
              sx={{ 
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'background.default',
                maxHeight: 100,
                overflow: 'auto',
                fontSize: '0.875rem'
              }}
            >
              <Typography variant="body2">
                {lastResponse}
              </Typography>
            </Box>
          </motion.div>
        )}
      </Paper>
    </motion.div>
  );
};

export default AIAssistant;
