'use client';

import { useI18nStore, Language } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LanguageSelector() {
  const { language, setLanguage } = useI18nStore();

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="gap-2"
      title={`Switch to ${language === 'vi' ? 'English' : 'Tiếng Việt'}`}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase text-xs">{language}</span>
    </Button>
  );
}