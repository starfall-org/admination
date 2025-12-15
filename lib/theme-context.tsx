'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Lấy theme từ localStorage khi khởi tạo
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme && ['light', 'dark'].includes(storedTheme)) {
      setTheme(storedTheme);
      setResolvedTheme(storedTheme);
    } else {
      // Nếu chưa có theme, kiểm tra system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
      setResolvedTheme(systemTheme);
    }
  }, []);

  useEffect(() => {
    // Lưu theme vào localStorage và áp dụng
    localStorage.setItem('theme', theme);
    setResolvedTheme(theme);
  }, [theme]);

  // Áp dụng class cho HTML element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}