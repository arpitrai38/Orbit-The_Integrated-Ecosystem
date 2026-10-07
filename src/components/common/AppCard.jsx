import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';

export const AppCard = ({
  title,
  subtitle,
  action,
  children,
  footer,
  noPadding = false,
  sx = {},
  contentSx = {},
  ...props
}) => {
  const hasHeader = Boolean(title || subtitle || action);

  return (
    <Card
      sx={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
      {...props}
    >
      {hasHeader && (
        <CardHeader
          title={
            typeof title === 'string' ? (
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            ) : (
              title
            )
          }
          subheader={
            typeof subtitle === 'string' ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            ) : (
              subtitle
            )
          }
          action={action}
          sx={{
            pb: 1.5,
            pt: 2,
            px: 2.5,
          }}
        />
      )}
      <CardContent
        sx={{
          p: noPadding ? 0 : 2.5,
          pt: hasHeader ? (noPadding ? 0 : 1) : (noPadding ? 0 : 2.5),
          flexGrow: 1,
          '&:last-child': {
            pb: noPadding ? 0 : 2.5,
          },
          ...contentSx,
        }}
      >
        {children}
      </CardContent>
      {footer && (
        <CardActions
          sx={{
            px: 2.5,
            py: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
          }}
        >
          {footer}
        </CardActions>
      )}
    </Card>
  );
};

export default AppCard;
