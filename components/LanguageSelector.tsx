'use client';

import { useI18nStore, Language } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useI18nStore();

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
      title={`Switch to ${language === 'vi' ? 'English' : 'Tiếng Việt'}`}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase">{language}</span>
    </button>
  );
}