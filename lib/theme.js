import { createContext, useContext, useEffect } from 'react';
import { useMedia } from 'react-use';
import { useConfig } from '@/lib/config';

const ThemeContext = createContext({
  dark: true,
  toggleDark: () => {},
  setTheme: theme => {},
});

export function ThemeProvider({ children }) {
  const { appearance } = useConfig();

  // `defaultState` should normally be a boolean. But it causes initial loading flashes in slow
  // rendering. Setting it to `null` so that we can differentiate the initial loading phase
  const prefersDark = useMedia('(prefers-color-scheme: dark)', null);
  const dark = appearance === 'dark' || (appearance === 'auto' && prefersDark);

  const setTheme = theme => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  };

  const toggleDark = () => {
    const theme = dark ? 'light' : 'dark';
    setTheme(theme === 'dark' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Only decide color scheme after initial loading, i.e. when `dark` is really representing a
    // media query result
    if (typeof dark === 'boolean') {
      document.documentElement.classList.toggle('dark', dark);
      document.documentElement.classList.remove('color-scheme-unset');
    }
  }, [dark]);

  return (
    <ThemeContext.Provider
      value={{
        dark,
        toggleDark,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export default function useTheme() {
  return useContext(ThemeContext);
}
