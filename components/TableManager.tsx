'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, Database } from 'lucide-react';
import { useI18nStore } from '@/lib/i18n';
import { useDatabaseStore } from '@/lib/store';

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
}

interface TableManagerProps {
  onClose: () => void;
  mode: 'create' | 'edit' | 'delete';
  tableName?: string;
  onTableCreated?: (tableName: string) => void;
  onTableUpdated?: (oldName: string, newName: string) => void;
  onTableDeleted?: (tableName: string) => void;
}

export default function TableManager({ 
  onClose, 
  mode, 
  tableName, 
  onTableCreated, 
  onTableUpdated, 
  onTableDeleted 
}: TableManagerProps) {
  const { t } = useI18nStore();
  const { connection } = useDatabaseStore();
  
  const [formData, setFormData] = useState({
    tableName: mode === 'edit' ? tableName || '' : '',
    newTableName: '',
    columns: mode === 'create' ? [
      { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true },
      { name: '', type: 'VARCHAR(255)', nullable: true, primaryKey: false }
    ] : []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const columnTypes = [
    { value: 'INTEGER', label: t('typeInteger') },
    { value: 'VARCHAR(255)', label: t('typeVarchar') },
    { value: 'TEXT', label: t('typeText') },
    { value: 'BOOLEAN', label: t('typeBoolean') },
    { value: 'DECIMAL(10,2)', label: t('typeDecimal') },
    { value: 'DATE', label: t('typeDate') },
    { value: 'TIMESTAMP', label: t('typeTimestamp') }
  ];

  const addColumn = () => {
    setFormData(prev => ({
      ...prev,
      columns: [...prev.columns, { name: '', type: 'VARCHAR(255)', nullable: true, primaryKey: false }]
    }));
  };

  const removeColumn = (index: number) => {
    setFormData(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index)
    }));
  };

  const updateColumn = (index: number, field: keyof Column, value: any) => {
    setFormData(prev => ({
      ...prev,
      columns: prev.columns.map((col, i) => 
        i === index ? { ...col, [field]: value } : col
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!connection) {
        throw new Error('No database connection');
      }

      let endpoint = '';
      let payload: any = {
        url: connection.url,
        type: connection.type
      };

      switch (mode) {
        case 'create':
          endpoint = '/api/tables/manage';
          payload = {
            ...payload,
            action: 'CREATE_TABLE',
            tableName: formData.tableName,
            columns: formData.columns.filter(col => col.name.trim() !== '')
          };
          break;

        case 'edit':
          endpoint = '/api/tables/manage';
          payload = {
            ...payload,
            action: 'ALTER_TABLE',
            tableName: tableName,
            newTableName: formData.newTableName
          };
          break;

        case 'delete':
          endpoint = '/api/tables/manage';
          payload = {
            ...payload,
            action: 'DROP_TABLE',
            tableName: tableName
          };
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Operation failed');
      }

      // Callbacks
      switch (mode) {
        case 'create':
          onTableCreated?.(formData.tableName);
          break;
        case 'edit':
          onTableUpdated?.(tableName!, formData.newTableName);
          break;
        case 'delete':
          onTableDeleted?.(tableName!);
          break;
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderCreateForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('tableName')}
        </label>
        <input
          type="text"
          value={formData.tableName}
          onChange={(e) => setFormData(prev => ({ ...prev, tableName: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('columnName')}
          </label>
          <button
            type="button"
            onClick={addColumn}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <Plus size={14} className="mr-1" />
            {t('addColumn')}
          </button>
        </div>

        <div className="space-y-2">
          {formData.columns.map((column, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <input
                type="text"
                value={column.name}
                onChange={(e) => updateColumn(index, 'name', e.target.value)}
                placeholder={t('columnName')}
                className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                required
              />
              
              <select
                value={column.type}
                onChange={(e) => updateColumn(index, 'type', e.target.value)}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              >
                {columnTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={column.nullable}
                  onChange={(e) => updateColumn(index, 'nullable', e.target.checked)}
                  className="mr-1"
                />
                <span className="text-sm">{t('nullable')}</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={column.primaryKey}
                  onChange={(e) => updateColumn(index, 'primaryKey', e.target.checked)}
                  className="mr-1"
                />
                <span className="text-sm">{t('primaryKey')}</span>
              </label>

              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeColumn(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          {t('cancelTable')}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
        >
          {loading ? (
            <span>{t('saving')}</span>
          ) : (
            <>
              <Save size={16} className="mr-1" />
              {t('saveTable')}
            </>
          )}
        </button>
      </div>
    </form>
  );

  const renderEditForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('currentName')}
        </label>
        <input
          type="text"
          value={tableName}
          disabled
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('newName')}
        </label>
        <input
          type="text"
          value={formData.newTableName}
          onChange={(e) => setFormData(prev => ({ ...prev, newTableName: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          {t('cancelTable')}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
        >
          {loading ? (
            <span>{t('saving')}</span>
          ) : (
            <>
              <Save size={16} className="mr-1" />
              {t('saveTable')}
            </>
          )}
        </button>
      </div>
    </form>
  );

  const renderDeleteForm = () => (
    <div className="space-y-4">
      {!showDeleteConfirm ? (
        <>
          <div className="text-center py-4">
            <Database className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t('confirmDeleteTable')}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {t('deleteTableWarning')}
            </p>
            <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded">
              {tableName}
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              {t('cancelTable')}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
            >
              <Trash2 size={16} className="mr-1" />
              {t('deleteTable')}
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="text-center py-4">
            <p className="text-red-600 dark:text-red-400 font-medium">
              {t('areYouSure')} {t('tableWillBePermanently')} "{tableName}"
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              {t('cancelTable')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <span>{t('saving')}</span>
              ) : (
                <>
                  <Trash2 size={16} className="mr-1" />
                  {t('deletePermanently')}
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            {mode === 'create' && <Plus size={20} className="mr-2" />}
            {mode === 'edit' && <Edit2 size={20} className="mr-2" />}
            {mode === 'delete' && <Trash2 size={20} className="mr-2" />}
            {mode === 'create' && t('createTable')}
            {mode === 'edit' && t('editTable')}
            {mode === 'delete' && t('deleteTable')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded">
            {error}
          </div>
        )}

        {mode === 'create' && renderCreateForm()}
        {mode === 'edit' && renderEditForm()}
        {mode === 'delete' && renderDeleteForm()}
      </div>
    </div>
  );
}