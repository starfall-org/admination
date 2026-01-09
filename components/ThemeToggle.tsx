'use client';

import { useTheme } from '@/lib/theme-context';
import { useI18nStore } from '@/lib/i18n';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useI18nStore();

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className="gap-2"
      title={isDark ? t('switchToLight') : t('switchToDark')}
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
      <span className="hidden sm:inline text-xs">
        {isDark ? t('lightTheme') : t('darkTheme')}
      </span>
    </Button>
  );
}