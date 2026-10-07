import React from 'react';
import Drawer from '@mui/material/Drawer';
import { Sidebar } from './Sidebar';

export const MobileNav = ({ open, onClose, width = 280 }) => {
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: width,
        },
      }}
    >
      <Sidebar onClose={onClose} />
    </Drawer>
  );
};

export default MobileNav;
