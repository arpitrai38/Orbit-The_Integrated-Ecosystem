import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import { useThemeMode } from '../hooks/useThemeMode';

export const AuthLayout = () => {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: (theme) => theme.palette.background.default,
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse at 50% 0%, rgba(79, 70, 229, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 0%, rgba(79, 70, 229, 0.08) 0%, transparent 70%)',
      }}
    >
      {/* Top Header */}
      <Box
        sx={{
          py: 2.5,
          px: { xs: 2.5, sm: 4 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          component={NavLink}
          to="/"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            '&:hover': { color: 'primary.main' },
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              size="medium"
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Auth Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
        }}
      >
        <Outlet />
      </Box>

      {/* Auth Footer */}
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          ORBIT — Integrated College ERP &amp; LMS • Final-Year B.Tech Project
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthLayout;
