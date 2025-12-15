'use client';

import { useDatabaseStore } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';
import { Database, LogOut } from 'lucide-react';

export default function ConnectionInfo() {
  const { connection, disconnect } = useDatabaseStore();
  const { t } = useI18nStore();

  if (!connection) return null;

  const getDatabaseIcon = () => {
    return Database;
  };

  const getDatabaseName = (type: 'postgresql' | 'mysql' | 'turso') => {
    return t(type);
  };

  const getConnectionStatusColor = () => {
    return connection.connected 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  const maskUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const maskedUrl = urlObj.hostname + urlObj.pathname;
      return maskedUrl;
    } catch {
      return url.length > 30 ? url.substring(0, 30) + '...' : url;
    }
  };

  const IconComponent = getDatabaseIcon();

  return (
    <div className="flex items-center space-x-4">
      {/* Connection Status */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <div className="text-sm">
            <div className="font-medium text-gray-900 dark:text-white">
              {getDatabaseName(connection.type)}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              {maskUrl(connection.url)}
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          connection.connected ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <span className={`text-sm font-medium ${getConnectionStatusColor()}`}>
          {connection.connected ? t('connected') : 'Disconnected'}
        </span>
      </div>

      {/* Disconnect Button */}
      <button
        onClick={disconnect}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
      >
        <LogOut className="w-4 h-4" />
        <span>{t('disconnect')}</span>
      </button>
    </div>
  );
}