import React from 'react';
import Container from '@mui/material/Container';

export const ResponsiveContainer = ({
  children,
  maxWidth = 'xl',
  disableGutters = false,
  sx = {},
  ...props
}) => {
  return (
    <Container
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      sx={{
        px: disableGutters ? 0 : { xs: 2, sm: 3, md: 4 },
        py: { xs: 2.5, sm: 3.5, md: 4 },
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
};

export default ResponsiveContainer;
