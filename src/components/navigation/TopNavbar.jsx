import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import MuiMenu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Menu, Sun, Moon, Bell, LogOut, Shield } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
import { ROUTES } from '../../routes/routeConfig';
import { getLoggedInUser, getDynamicGreeting, logoutUser } from '../../utils/greeting';

export const TopNavbar = ({ onDrawerToggle, sidebarOpen = false }) => {
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();

  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logoutUser();
    navigate(ROUTES.AUTH.LOGIN);
  };

  const defaultFallback = location.pathname.startsWith('/admin')
    ? 'Administrator'
    : location.pathname.startsWith('/faculty')
    ? 'Faculty Member'
    : location.pathname.startsWith('/student')
    ? 'Student Scholar'
    : location.pathname.startsWith('/parent')
    ? 'Guardian'
    : 'User';

  const user = getLoggedInUser(defaultFallback);
  const greeting = getDynamicGreeting();

  const getPortalInfo = () => {
    if (location.pathname.startsWith('/admin')) {
      return { title: 'Admin ERP Portal', role: 'Administrator' };
    }
    if (location.pathname.startsWith('/faculty')) {
      return { title: 'Faculty Academic Suite', role: 'Faculty / Educator' };
    }
    if (location.pathname.startsWith('/student')) {
      return { title: 'Student Learning Hub', role: 'Student' };
    }
    if (location.pathname.startsWith('/parent')) {
      return { title: 'Parent Guardian Portal', role: 'Guardian' };
    }
    return { title: 'Institutional Overview', role: 'ORBIT Core' };
  };

  const portal = getPortalInfo();

  const userInitials = (user.name || 'User')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const displayRole =
    user.role === 'ADMIN'
      ? 'Admin'
      : user.role === 'TEACHER'
      ? 'Faculty'
      : user.role === 'STUDENT'
      ? 'Student'
      : user.role === 'PARENT'
      ? 'Parent'
      : (user.role || 'Admin');

  return (
    <AppBar
      position="sticky"
      sx={{
        width: '100%',
        backgroundColor: mode === 'light' ? '#FFFFFF' : 'rgba(17, 24, 39, 0.95)',
        borderBottom: `1px solid ${mode === 'light' ? '#E5EBF5' : 'rgba(255, 255, 255, 0.08)'}`,
        boxShadow: 'none',
        color: mode === 'light' ? '#1E293B' : '#F8FAFC',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        {/* Left: Hamburger Menu Button & Greeting */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title={sidebarOpen ? 'Close Sidebar (Full Screen)' : 'Open Navigation Menu'} arrow>
            <IconButton
              color="inherit"
              aria-label="toggle navigation sidebar"
              edge="start"
              onClick={onDrawerToggle}
              sx={{
                p: 0.9,
                borderRadius: 2.2,
                bgcolor: sidebarOpen
                  ? mode === 'light'
                    ? 'rgba(30, 107, 255, 0.1)'
                    : 'rgba(96, 165, 250, 0.15)'
                  : mode === 'light'
                  ? '#F1F5F9'
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${
                  sidebarOpen
                    ? mode === 'light'
                      ? 'rgba(30, 107, 255, 0.3)'
                      : 'rgba(96, 165, 250, 0.35)'
                    : mode === 'light'
                    ? '#E2E8F0'
                    : 'rgba(255, 255, 255, 0.08)'
                }`,
                color: sidebarOpen
                  ? mode === 'light'
                    ? '#1E6BFF'
                    : '#60A5FA'
                  : mode === 'light'
                  ? '#1E293B'
                  : '#F8FAFC',
                transition: 'all 0.18s ease',
                '&:hover': {
                  bgcolor: mode === 'light' ? '#E2E8F0' : 'rgba(255, 255, 255, 0.12)',
                  color: mode === 'light' ? '#1E6BFF' : '#60A5FA',
                  transform: 'scale(1.04)',
                },
              }}
            >
              <Menu size={20} strokeWidth={2.2} />
            </IconButton>
          </Tooltip>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '0.95rem', sm: '1.18rem' },
                letterSpacing: '-0.015em',
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
              }}
            >
              <span>{greeting},</span>
              <span style={{ color: mode === 'light' ? '#1E6BFF' : '#60A5FA' }}>
                {user.name}
              </span>
              <span>👋</span>
            </Typography>

            <Chip
              label={displayRole}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.68rem',
                fontWeight: 700,
                borderRadius: '6px',
                bgcolor: mode === 'light' ? 'rgba(30, 107, 255, 0.08)' : 'rgba(96, 165, 250, 0.15)',
                color: mode === 'light' ? '#1E6BFF' : '#93C5FD',
                border: `1px solid ${mode === 'light' ? 'rgba(30, 107, 255, 0.22)' : 'rgba(96, 165, 250, 0.3)'}`,
              }}
            />
          </Box>
        </Box>

        {/* Right Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              size="medium"
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: mode === 'light' ? '#E5EBF5' : 'rgba(255,255,255,0.1)',
              }}
            >
              {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications (4 New)">
            <IconButton
              color="inherit"
              size="medium"
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: mode === 'light' ? '#E5EBF5' : 'rgba(255,255,255,0.1)',
              }}
            >
              <Badge badgeContent={4} color="error" variant="dot">
                <Bell size={18} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Direct Logout Button */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<LogOut size={15} />}
            onClick={handleLogout}
            sx={{
              ml: 0.5,
              borderRadius: 2,
              borderColor: mode === 'light' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.45)',
              color: '#EF4444',
              fontWeight: 800,
              fontSize: '0.8rem',
              textTransform: 'none',
              px: 1.8,
              py: 0.5,
              transition: 'all 0.2s ease',
              display: { xs: 'none', sm: 'inline-flex' },
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.08)',
                borderColor: '#EF4444',
                color: '#DC2626',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)',
              },
            }}
          >
            Logout
          </Button>

          <Tooltip title={`${user.name} (${user.role || portal.role}) - Account & Logout`}>
            <Avatar
              onClick={handleUserMenuOpen}
              sx={{
                width: 35,
                height: 35,
                fontSize: '0.8125rem',
                fontWeight: 800,
                backgroundColor: '#1E6BFF',
                color: '#FFFFFF',
                cursor: 'pointer',
                ml: 0.5,
                boxShadow: '0 2px 8px rgba(30, 107, 255, 0.3)',
                transition: 'all 0.18s ease',
                '&:hover': {
                  transform: 'scale(1.06)',
                  boxShadow: '0 4px 12px rgba(30, 107, 255, 0.45)',
                },
              }}
            >
              {userInitials || 'OB'}
            </Avatar>
          </Tooltip>

          {/* User Account & Logout Dropdown Menu */}
          <MuiMenu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.2,
                minWidth: 230,
                borderRadius: 2.5,
                border: `1px solid ${mode === 'light' ? '#E5EBF5' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                overflow: 'visible',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.3 }}>
                {user.department || 'ORBIT Campus'}
              </Typography>
              <Chip
                label={user.role || portal.role}
                size="small"
                sx={{
                  mt: 0.8,
                  height: 20,
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  bgcolor: '#EFF6FF',
                  color: '#1E6BFF',
                }}
              />
            </Box>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              onClick={() => {
                handleUserMenuClose();
                navigate(ROUTES.MODULES.SETTINGS);
              }}
              sx={{ py: 1, fontSize: '0.85rem', fontWeight: 600 }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Shield size={16} color="#64748B" />
              </ListItemIcon>
              <ListItemText primary="System Settings" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600 }} />
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1,
                color: '#EF4444',
                fontSize: '0.85rem',
                fontWeight: 700,
                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: '#EF4444' }}>
                <LogOut size={16} />
              </ListItemIcon>
              <ListItemText primary="Logout of Account" primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 700, color: '#EF4444' }} />
            </MenuItem>
          </MuiMenu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
