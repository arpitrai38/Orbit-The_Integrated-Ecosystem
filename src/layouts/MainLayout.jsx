import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Sidebar } from '../components/navigation/Sidebar';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { OrbitAiChatWidget } from '../components/common/OrbitAiChatWidget';

const SIDEBAR_WIDTH = 270;
const CURRENT_YEAR = new Date().getFullYear();

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleDrawerToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        position: 'relative',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      {/* 1. Persistent Push Collapsible Sidebar */}
      <Box
        component="aside"
        sx={{
          width: sidebarOpen ? SIDEBAR_WIDTH : 0,
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          overflow: 'hidden',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRight: (theme) =>
            sidebarOpen
              ? `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#E5EBF5'}`
              : 'none',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0F172A' : '#FFFFFF'),
        }}
      >
        <Box sx={{ width: SIDEBAR_WIDTH, height: '100%' }}>
          <Sidebar onClose={handleDrawerClose} />
        </Box>
      </Box>

      {/* 2. Main Content Column: Smoothly expands to full screen when closed, shifts right when opened */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        {/* Top Navbar */}
        <TopNavbar onDrawerToggle={handleDrawerToggle} sidebarOpen={sidebarOpen} />

        {/* Dynamic Page Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <Outlet />

          {/* Minimal Clean EdTech Footer */}
          <Box
            component="footer"
            sx={{
              mt: 'auto',
              py: 2.5,
              px: { xs: 2, sm: 4 },
              borderTop: '1px solid #E5EBF5',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              backgroundColor: '#FFFFFF',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {CURRENT_YEAR} ORBIT — Integrated College ERP &amp; LMS Platform.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Campus Intelligence Active • Final-Year B.Tech Project
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Floating Circular Robot Chatbot on Right Side */}
      <OrbitAiChatWidget />
    </Box>
  );
};

export default MainLayout;
