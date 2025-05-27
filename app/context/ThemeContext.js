import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const theme = {
    colors: {
      primary: '#007AFF',
      background: isDark ? '#000' : '#f5f5f5',
      card: isDark ? '#1c1c1e' : '#fff',
      text: isDark ? '#fff' : '#000',
      border: isDark ? '#3a3a3c' : '#c6c6c8',
    },
    isDark,
    toggleTheme: () => setIsDark(!isDark),
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};