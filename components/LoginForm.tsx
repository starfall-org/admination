'use client';

import { useState } from 'react';
import { useDatabaseStore } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';
import { Database, Loader2 } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const DATABASE_TYPES = [
  { value: 'postgresql', label: 'postgresql', icon: Database },
  { value: 'mysql', label: 'mysql', icon: Database },
  { value: 'turso', label: 'turso', icon: Database }
] as const;

export default function LoginForm() {
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'postgresql' | 'mysql' | 'turso'>('postgresql');
  const { connect, isConnecting, connectionError } = useDatabaseStore();
  const { t } = useI18nStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    await connect(url, type);
  };

  const handleSampleUrl = (dbType: 'postgresql' | 'mysql' | 'turso') => {
    const sampleUrls = {
      postgresql: 'postgresql://username:password@localhost:5432/database_name',
      mysql: 'mysql://username:password@localhost:3306/database_name',
      turso: 'libsql://username:password@your-db.turso.io'
    };
    setUrl(sampleUrls[dbType]);
    setType(dbType);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 relative">
      {/* Theme toggle in top right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('databaseVisualizer')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Kết nối và khám phá database của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('databaseType')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DATABASE_TYPES.map((dbType) => {
                const IconComponent = dbType.icon;
                return (
                  <button
                    key={dbType.value}
                    type="button"
                    onClick={() => setType(dbType.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                      type === dbType.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="mb-1 flex justify-center">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-medium">{t(dbType.label)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('databaseUrl')}
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Nhập database URL của bạn..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              required
            />
          </div>

          {connectionError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{connectionError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isConnecting || !url.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('connecting')}
              </>
            ) : (
              t('connectDatabase')
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
            {t('tryWithSampleUrl')}
          </p>
          <div className="space-y-2">
            {DATABASE_TYPES.map((dbType) => {
              const IconComponent = dbType.icon;
              return (
                <button
                  key={dbType.value}
                  type="button"
                  onClick={() => handleSampleUrl(dbType.value)}
                  className="w-full text-left p-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center"
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {t(dbType.label)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('supportedDatabases')}
          </p>
        </div>
      </div>
    </div>
  );
}