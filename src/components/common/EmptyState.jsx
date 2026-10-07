import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FolderSearch } from 'lucide-react';

export const EmptyState = ({
  title = 'No records found',
  description = 'There is currently no data available to display.',
  icon,
  action,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        py: 6,
        px: 3,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        border: '1px dashed',
        borderColor: 'divider',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.01)',
        ...sx,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(79, 70, 229, 0.15)' : 'rgba(79, 70, 229, 0.08)',
          color: 'primary.main',
        }}
      >
        {icon || <FolderSearch size={28} />}
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.75 }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 440, mb: action ? 2.5 : 0 }}
      >
        {description}
      </Typography>
      {action && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  );
};

export default EmptyState;
