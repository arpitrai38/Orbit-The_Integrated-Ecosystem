import React from 'react';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const STATUS_CONFIGS = {
  active: { label: 'Active', color: 'success' },
  success: { label: 'Completed', color: 'success' },
  pending: { label: 'Pending', color: 'warning' },
  warning: { label: 'Warning', color: 'warning' },
  error: { label: 'Inactive', color: 'error' },
  danger: { label: 'Failed', color: 'error' },
  info: { label: 'Information', color: 'info' },
  default: { label: 'Draft', color: 'default' },
};

export const StatusBadge = ({
  status = 'default',
  label,
  size = 'small',
  dot = true,
  sx = {},
}) => {
  const config = STATUS_CONFIGS[status.toLowerCase()] || STATUS_CONFIGS.default;
  const displayLabel = label || config.label;

  return (
    <Chip
      size={size}
      color={config.color}
      variant="outlined"
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          {dot && (
            <Box
              component="span"
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'currentColor',
                display: 'inline-block',
              }}
            />
          )}
          <span>{displayLabel}</span>
        </Box>
      }
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        height: 24,
        ...sx,
      }}
    />
  );
};

export default StatusBadge;
