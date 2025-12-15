'use client';

import { useState } from 'react';
import { BarChart3, Plus, Download, RefreshCw, FileText } from 'lucide-react';
import { Table } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';
import { useDatabaseStore } from '@/lib/store';
import InlineEditCell from './InlineEditCell';
import RowActions from './RowActions';

interface DataTableProps {
  table: Table;
}

export default function DataTable({ table }: DataTableProps) {
  const { t } = useI18nStore();
  const { editingRows, addNewRow, updateEditingValue, saveEditing, cancelEditing } = useDatabaseStore();
  const [showAddForm, setShowAddForm] = useState(false);

  if (!table.columns || table.columns.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('noColumns')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {t('noTableSelected')} "{table.name}"
          </p>
        </div>
      </div>
    );
  }

  const handleCellEdit = (rowIndex: number, columnName: string, value: any) => {
    updateEditingValue(rowIndex, columnName, value);
  };

  const handleSave = async (rowIndex: number) => {
    await saveEditing(rowIndex);
  };

  const handleCancel = (rowIndex: number) => {
    cancelEditing(rowIndex);
  };

  const getCurrentRowData = (rowIndex: number) => {
    const editingRow = editingRows.find(e => e.rowIndex === rowIndex);
    return editingRow ? editingRow.editedData : table.rows[rowIndex];
  };

  const isEditingRow = (rowIndex: number) => {
    return editingRows.some(e => e.rowIndex === rowIndex);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
              <BarChart3 className="mr-3" size={28} />
              {table.name}
            </h2>
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{table.columns.length} {t('columns')}</span>
              <span>{table.rows.length + editingRows.filter(e => e.isNew).length} {t('rows')}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => addNewRow()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>{t('addRow')}</span>
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
              <Download size={16} />
              <span>{t('exportCsv')}</span>
            </button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2">
              <RefreshCw size={16} />
              <span>{t('refresh')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-800">
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {table.columns.map((column) => (
                  <th
                    key={column.name}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{column.name}</span>
                      <span className="text-xs font-normal opacity-75">{column.type}</span>
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {table.rows.length === 0 && editingRows.filter(e => e.isNew).length === 0 ? (
                <tr>
                  <td
                    colSpan={table.columns.length + 1}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      <FileText className="mb-2" size={48} />
                      <p>{t('noData')}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {/* Existing rows */}
                  {table.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                        isEditingRow(rowIndex) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      {table.columns.map((column) => {
                        const editingRow = editingRows.find(e => e.rowIndex === rowIndex);
                        const isEditing = !!editingRow;
                        const currentValue = editingRow ? editingRow.editedData[column.name] : row[column.name];

                        return (
                          <td
                            key={column.name}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                          >
                            <InlineEditCell
                              value={currentValue}
                              column={column}
                              rowIndex={rowIndex}
                              isEditing={isEditing}
                              onSave={(value) => handleCellEdit(rowIndex, column.name, value)}
                              onCancel={() => handleCancel(rowIndex)}
                            />
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <RowActions
                          rowIndex={rowIndex}
                          isEditing={isEditingRow(rowIndex)}
                          isNew={false}
                        />
                      </td>
                    </tr>
                  ))}
                  
                  {/* New rows (not yet saved) */}
                  {editingRows.filter(e => e.isNew).map((editingRow) => (
                    <tr
                      key={`new-${editingRow.rowIndex}`}
                      className="bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-150"
                    >
                      {table.columns.map((column) => (
                        <td
                          key={column.name}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                        >
                          <InlineEditCell
                            value={editingRow.editedData[column.name]}
                            column={column}
                            rowIndex={editingRow.rowIndex}
                            isEditing={true}
                            onSave={(value) => handleCellEdit(editingRow.rowIndex, column.name, value)}
                            onCancel={() => handleCancel(editingRow.rowIndex)}
                          />
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <RowActions
                          rowIndex={editingRow.rowIndex}
                          isEditing={true}
                          isNew={true}
                        />
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            {t('showingRows')} {table.rows.length} {t('rows')}
            {editingRows.filter(e => e.isNew).length > 0 &&
              ` (+${editingRows.filter(e => e.isNew).length} ${t('rowsWithNew')})`
            }
          </span>
          <div className="flex space-x-2">
            {editingRows.length > 0 && (
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                {t('rowsEditing')} {editingRows.length} {t('editRowsCount')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}