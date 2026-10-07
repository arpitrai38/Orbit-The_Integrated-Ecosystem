import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  icon,
  change,
  trend = 'up',
  subtitle,
  iconBgColor = 'primary.main',
  sx = {},
}) => {
  const isUp = trend === 'up';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 8px 24px -4px rgba(0, 0, 0, 0.6)'
              : '0 8px 24px -4px rgba(79, 70, 229, 0.12)',
        },
        ...sx,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mt: 0.75, mb: 0.5 }}>
              {value}
            </Typography>
          </Box>
          {icon && (
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(79, 70, 229, 0.18)'
                    : 'rgba(79, 70, 229, 0.08)',
                color: iconBgColor,
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        {(change || subtitle) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
            {change && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.4,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: isUp ? 'success.main' : 'error.main',
                  backgroundColor: (theme) =>
                    isUp
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(16, 185, 129, 0.1)'
                      : theme.palette.mode === 'dark'
                        ? 'rgba(239, 68, 68, 0.15)'
                        : 'rgba(239, 68, 68, 0.1)',
                  px: 0.8,
                  py: 0.3,
                  borderRadius: 1,
                }}
              >
                {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{change}</span>
              </Box>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
