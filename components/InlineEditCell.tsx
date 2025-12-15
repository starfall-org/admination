'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Column } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';

interface InlineEditCellProps {
  value: any;
  column: Column;
  rowIndex: number;
  isEditing: boolean;
  onSave: (value: any) => void;
  onCancel: () => void;
}

export default function InlineEditCell({
  value,
  column,
  rowIndex,
  isEditing,
  onSave,
  onCancel
}: InlineEditCellProps) {
  const { t } = useI18nStore();
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const getInputType = () => {
    const type = column.type.toUpperCase();
    
    if (type.includes('INT') || type.includes('DECIMAL') || type.includes('NUMERIC')) {
      return 'number';
    }
    if (type.includes('DATE') || type.includes('TIME')) {
      return 'datetime-local';
    }
    return 'text';
  };

  if (isEditing) {
    return (
      <div className="relative">
        <input
          type={getInputType()}
          value={editValue || ''}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="w-full px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          autoFocus
        />
        <div className="absolute -bottom-6 left-0 flex space-x-1">
          <button
            onClick={handleSave}
            className="px-1 py-0.5 text-xs bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
            title={t('save')}
          >
            <Check size={12} />
          </button>
          <button
            onClick={onCancel}
            className="px-1 py-0.5 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
            title={t('cancel')}
          >
            <X size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded transition-colors duration-150"
      title={t('clickToEdit')}
    >
      {value === null || value === undefined || value === '' ? (
        <span className="text-gray-400 italic">{t('nullValue')}</span>
      ) : (
        <span className="text-sm text-gray-900 dark:text-gray-100">
          {String(value)}
        </span>
      )}
    </div>
  );
}