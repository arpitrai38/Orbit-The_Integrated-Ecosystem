import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const OrbitLogo = ({ size = 32, showText = true, sx = {} }) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        userSelect: 'none',
        textDecoration: 'none',
        ...sx,
      }}
    >
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: `${size * 0.28}px`,
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #0EA5E9 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
          flexShrink: 0,
        }}
      >
        <svg
          width={size * 0.65}
          height={size * 0.65}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="4.5" fill="#FFFFFF" />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="4.5"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            transform="rotate(-25 12 12)"
            strokeDasharray="4 2"
          />
          <circle cx="19" cy="8.5" r="1.5" fill="#FFFFFF" />
        </svg>
      </Box>

      {showText && (
        <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <Typography
            component="span"
            sx={{
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1,
            }}
          >
            ORBIT
          </Typography>
          <Typography
            component="span"
            variant="caption"
            sx={{
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'text.secondary',
              lineHeight: 1,
            }}
          >
            ERP & LMS
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OrbitLogo;
