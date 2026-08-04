import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Light mode only — no theme switching
  return (
    <ThemeContext.Provider value={{ darkMode: false, toggleDarkMode: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};
