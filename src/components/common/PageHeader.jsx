import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

export const PageHeader = ({
  title,
  subtitle,
  badge,
  action,
  breadcrumbs,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        mb: 3.5,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        ...sx,
      }}
    >
      <Box>
        {breadcrumbs && (
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{ mb: 1, '& .MuiBreadcrumbs-li': { fontSize: '0.8125rem' } }}
          >
            {breadcrumbs}
          </Breadcrumbs>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>
          {badge}
        </Box>
        {subtitle && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 0.5, maxWidth: 640 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
            alignSelf: { xs: 'flex-start', sm: 'center' },
          }}
        >
          {action}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;
