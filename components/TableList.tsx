'use client';

import { useDatabaseStore } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';

export default function TableList() {
  const { tables, selectedTable, setSelectedTable, isLoading } = useDatabaseStore();
  const { t } = useI18nStore();

  if (isLoading) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('tables')}
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('tables')}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {tables.length} {t('tables')}
        </span>
      </div>

      {tables.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl text-gray-400">📋</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t('noTables')}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {tables.map((table) => (
            <button
              key={table.name}
              onClick={() => setSelectedTable(table.name)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                selectedTable === table.name
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg mr-3">📊</span>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {table.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {table.columns.length} {t('columns')} • {table.rows.length} {t('rows')}
                    </p>
                  </div>
                </div>
                {selectedTable === table.name && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}