import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export const LoadingScreen = ({
  message = 'Loading...',
  fullscreen = false,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 4,
        ...(fullscreen
          ? {
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9999,
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(11, 15, 25, 0.9)'
                  : 'rgba(248, 250, 252, 0.9)',
              backdropFilter: 'blur(6px)',
            }
          : {
              minHeight: 280,
              width: '100%',
            }),
        ...sx,
      }}
    >
      <CircularProgress
        size={40}
        thickness={4}
        sx={{
          color: 'primary.main',
        }}
      />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingScreen;
