'use client';

import { useEffect } from 'react';
import { useDatabaseStore } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';
import TableList from './TableList';
import DataTable from './DataTable';
import ConnectionInfo from './ConnectionInfo';
import LanguageSelector from './LanguageSelector';

export default function DatabaseViewer() {
  const { connection, tables, selectedTable, loadTables, disconnect } = useDatabaseStore();
  const { t } = useI18nStore();

  useEffect(() => {
    if (connection?.connected && tables.length === 0) {
      loadTables();
    }
  }, [connection, tables.length, loadTables]);

  if (!connection) {
    return null;
  }

  const selectedTableData = tables.find(table => table.name === selectedTable);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-lg">🗄️</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('databaseVisualizer')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <ConnectionInfo />
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Table List */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
          <TableList />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {selectedTableData ? (
            <DataTable table={selectedTableData} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-gray-400">📊</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('selectTableToViewData')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t('chooseTableFromList')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}