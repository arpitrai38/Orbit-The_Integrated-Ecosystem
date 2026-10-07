import { createTheme } from '@mui/material/styles';
import { getPalette } from './palette';
import { typography } from './typography';
import { getComponentOverrides } from './components';

export const createAppTheme = (mode = 'light') => {
  return createTheme({
    palette: getPalette(mode),
    typography,
    shape: {
      borderRadius: 10,
    },
    components: getComponentOverrides(mode),
  });
};

export default createAppTheme;
