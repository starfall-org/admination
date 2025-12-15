'use client';

import { useState } from 'react';
import { FileText, Table, Plus, Settings, Trash2 } from 'lucide-react';
import { useDatabaseStore } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';
import TableManager from './TableManager';

export default function TableList() {
  const { tables, selectedTable, setSelectedTable, isLoading, loadTables } = useDatabaseStore();
  const { t } = useI18nStore();
  const [showTableManager, setShowTableManager] = useState(false);
  const [managerMode, setManagerMode] = useState<'create' | 'edit' | 'delete'>('create');
  const [selectedTableForManager, setSelectedTableForManager] = useState<string>('');

  const handleCreateTable = () => {
    setManagerMode('create');
    setShowTableManager(true);
  };

  const handleEditTable = (tableName: string) => {
    setSelectedTableForManager(tableName);
    setManagerMode('edit');
    setShowTableManager(true);
  };

  const handleDeleteTable = (tableName: string) => {
    setSelectedTableForManager(tableName);
    setManagerMode('delete');
    setShowTableManager(true);
  };

  const handleTableCreated = () => {
    loadTables();
    setShowTableManager(false);
  };

  const handleTableUpdated = () => {
    loadTables();
    setShowTableManager(false);
  };

  const handleTableDeleted = () => {
    loadTables();
    if (selectedTable === selectedTableForManager) {
      setSelectedTable(null);
    }
    setShowTableManager(false);
  };

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
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCreateTable}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            title={t('createTable')}
          >
            <Plus size={12} className="mr-1" />
            {t('createTable')}
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {tables.length} {t('tables')}
          </span>
        </div>
      </div>

      {tables.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {t('noTables')}
          </p>
          <button
            onClick={handleCreateTable}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center mx-auto"
          >
            <Plus size={16} className="mr-2" />
            {t('createTable')}
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {tables.map((table) => (
            <div
              key={table.name}
              className={`group relative rounded-lg transition-all duration-200 ${
                selectedTable === table.name
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <button
                onClick={() => setSelectedTable(table.name)}
                className="w-full text-left p-3 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Table className="text-gray-500 dark:text-gray-400 mr-3" size={18} />
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
              
              {/* Table actions */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTable(table.name);
                  }}
                  className="p-1 text-blue-500 hover:text-blue-700 bg-white dark:bg-gray-700 rounded shadow"
                  title={t('editTable')}
                >
                  <Settings size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTable(table.name);
                  }}
                  className="p-1 text-red-500 hover:text-red-700 bg-white dark:bg-gray-700 rounded shadow"
                  title={t('deleteTable')}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table Manager Modal */}
      {showTableManager && (
        <TableManager
          mode={managerMode}
          tableName={selectedTableForManager}
          onClose={() => setShowTableManager(false)}
          onTableCreated={handleTableCreated}
          onTableUpdated={handleTableUpdated}
          onTableDeleted={handleTableDeleted}
        />
      )}
    </div>
  );
}