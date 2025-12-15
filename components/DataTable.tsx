'use client';

import { Table } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';

interface DataTableProps {
  table: Table;
}

export default function DataTable({ table }: DataTableProps) {
  const { t } = useI18nStore();

  if (!table.columns || table.columns.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-gray-400">📋</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Không có cột dữ liệu
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Bảng "{table.name}" không có cột nào
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
              <span className="text-3xl mr-3">📊</span>
              {table.name}
            </h2>
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{table.columns.length} {t('columns')}</span>
              <span>{table.rows.length} {t('rows')}</span>
            </div>
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
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {table.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={table.columns.length}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-2">📭</span>
                      <p>Không có dữ liệu</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    {table.columns.map((column) => (
                      <td
                        key={column.name}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                      >
                        <div className="max-w-xs truncate" title={String(row[column.name] || '')}>
                          {row[column.name] === null || row[column.name] === undefined ? (
                            <span className="text-gray-400 italic">NULL</span>
                          ) : (
                            String(row[column.name])
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      {table.rows.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Hiển thị {table.rows.length} dòng</span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                Xuất CSV
              </button>
              <button className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                Làm mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}