import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActionCard = ({
  title,
  description,
  icon,
  badge,
  to,
  onClick,
  accentColor = 'primary.main',
  sx = {},
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <Card
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: accentColor,
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 8px 24px -4px rgba(0, 0, 0, 0.6)'
              : '0 8px 24px -4px rgba(79, 70, 229, 0.1)',
          '& .action-chevron': {
            transform: 'translateX(4px)',
            color: accentColor,
          },
        },
        ...sx,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(79, 70, 229, 0.18)'
                  : 'rgba(79, 70, 229, 0.08)',
              color: accentColor,
            }}
          >
            {icon}
          </Box>
          {badge}
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.75 }}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: accentColor,
          }}
        >
          <span>Open Portal</span>
          <ChevronRight
            size={16}
            className="action-chevron"
            style={{ transition: 'transform 0.2s ease, color 0.2s ease' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuickActionCard;
