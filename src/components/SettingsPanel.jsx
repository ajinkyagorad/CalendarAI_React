import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  IconButton,
  useTheme,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';

const SettingsPanel = ({ transparency, setTransparency, onClose }) => {
  const theme = useTheme();

  // Animation variants
  const panelVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={panelVariants}
    >
      <Paper
        elevation={4}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 360,
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          zIndex: 1300,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="medium">Settings</Typography>
          <IconButton size="small" onClick={onClose} edge="end">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Transparency
          </Typography>
          <Slider
            value={transparency}
            min={0.5}
            max={1}
            step={0.05}
            onChange={(_, newValue) => setTransparency(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={value => `${Math.round(value * 100)}%`}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Window Behavior
          </Typography>
          <FormControlLabel
            control={<Switch size="small" />}
            label="Always on top"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={<Switch size="small" />}
            label="Hide from taskbar"
          />
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Tip: Press Alt+Space to quickly hide/show the calendar
        </Typography>
      </Paper>
    </motion.div>
  );
};

export default SettingsPanel;
