import React from 'react';
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Home, Compass } from 'lucide-react';

import { AppButton } from '../components/common/AppButton';
import { ResponsiveContainer } from '../components/common/ResponsiveContainer';

export const NotFoundPage = () => {
  return (
    <ResponsiveContainer>
      <Box
        sx={{
          py: { xs: 8, sm: 12 },
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)',
            color: 'primary.main',
          }}
        >
          <Compass size={36} />
        </Box>
        <Typography variant="h1" sx={{ fontSize: { xs: '3rem', sm: '4.5rem' }, fontWeight: 800 }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600, mt: 1, mb: 1 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, mb: 3.5 }}>
          The requested page or route does not exist in ORBIT or may have been relocated.
        </Typography>
        <AppButton
          component={NavLink}
          to="/"
          variant="contained"
          color="primary"
          startIcon={<Home size={18} />}
        >
          Return to Dashboard Overview
        </AppButton>
      </Box>
    </ResponsiveContainer>
  );
};

export default NotFoundPage;
