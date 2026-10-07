import { useContext } from 'react';
import { ThemeContext } from '../theme/ThemeContextDefinition';

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within an OrbitThemeProvider');
  }
  return context;
};

export default useThemeMode;
