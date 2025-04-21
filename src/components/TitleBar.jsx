import React from 'react';
import { Box, Typography, IconButton, useTheme, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { motion } from 'framer-motion';

const TitleBar = ({ onSettingsClick, onExpandClick, isExpanded }) => {
  const theme = useTheme();
  
  // Window control functions
  const minimizeApp = () => {
    if (window.electronAPI) {
      window.electronAPI.minimizeApp();
    }
  };
  
  const closeApp = () => {
    if (window.electronAPI) {
      window.electronAPI.closeApp();
    } else {
      // For web version, just log
      console.log('Close app clicked');
    }
  };
  
  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 1.5,
        py: 0.5,
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        WebkitAppRegion: 'drag', // Make the title bar draggable
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarMonthIcon color="primary" fontSize="small" />
        <Typography variant="subtitle2" fontWeight="medium" noWrap sx={{ maxWidth: 150 }}>
          AI Gemini Calendar
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', WebkitAppRegion: 'no-drag' }}>
        <Tooltip title="Settings">
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <IconButton 
              size="small" 
              onClick={onSettingsClick}
              sx={{ mr: 0.5 }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </motion.div>
        </Tooltip>
        
        <Tooltip title={isExpanded ? "Collapse" : "Expand"}>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <IconButton 
              size="small" 
              onClick={onExpandClick}
              sx={{ mr: 0.5 }}
            >
              {isExpanded ? 
                <FullscreenExitIcon fontSize="small" /> : 
                <FullscreenIcon fontSize="small" />}
            </IconButton>
          </motion.div>
        </Tooltip>
        
        <Tooltip title="Minimize">
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <IconButton 
              size="small" 
              onClick={minimizeApp}
              sx={{ mr: 0.5 }}
            >
              <MinimizeIcon fontSize="small" />
            </IconButton>
          </motion.div>
        </Tooltip>
        
        <Tooltip title="Close">
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <IconButton
              size="small"
              onClick={closeApp}
              color="error"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </motion.div>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default TitleBar;
