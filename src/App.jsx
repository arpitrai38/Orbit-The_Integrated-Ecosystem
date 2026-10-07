import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { OrbitThemeProvider } from './theme/ThemeContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <OrbitThemeProvider>
        <AppRoutes />
      </OrbitThemeProvider>
    </BrowserRouter>
  );
}

export default App;
