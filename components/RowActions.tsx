'use client';

import { useState } from 'react';
import { Save, X, Edit, Trash2 } from 'lucide-react';
import { useDatabaseStore } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';

interface RowActionsProps {
  rowIndex: number;
  isEditing: boolean;
  isNew?: boolean;
}

export default function RowActions({ rowIndex, isEditing, isNew = false }: RowActionsProps) {
  const { startEditing, cancelEditing, saveEditing, deleteRow, editingRows } = useDatabaseStore();
  const { t } = useI18nStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    startEditing(rowIndex);
  };

  const handleCancel = () => {
    cancelEditing(rowIndex);
  };

  const handleSave = async () => {
    await saveEditing(rowIndex);
  };

  const handleDelete = async () => {
    await deleteRow(rowIndex);
    setShowDeleteConfirm(false);
  };

  const isCurrentlyEditing = editingRows.some(e => e.rowIndex === rowIndex);

  if (showDeleteConfirm) {
    return (
      <div className="flex items-center space-x-1">
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
        >
          <Trash2 size={12} className="mr-1" />
          {t('deleteConfirm')}
        </button>
        <button
          onClick={() => setShowDeleteConfirm(false)}
          className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          {t('deleteCancel')}
        </button>
      </div>
    );
  }

  if (isCurrentlyEditing) {
    return (
      <div className="flex items-center space-x-1">
        <button
          onClick={handleSave}
          className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
          title={t('save')}
        >
          <Save size={12} className="mr-1" />
          {t('save')}
        </button>
        <button
          onClick={handleCancel}
          className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center"
          title={t('cancel')}
        >
          <X size={12} className="mr-1" />
          {t('cancel')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={handleEdit}
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        title={t('edit')}
      >
        <Edit size={12} className="mr-1" />
        {t('edit')}
      </button>
      {!isNew && (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
          title={t('delete')}
        >
          <Trash2 size={12} className="mr-1" />
          {t('delete')}
        </button>
      )}
    </div>
  );
}