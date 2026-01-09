'use client';

import { useState } from 'react';
import { Save, X, Edit, Trash2 } from 'lucide-react';
import { useDatabaseStore } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

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
      <div className="flex items-center gap-1">
        <Button
          onClick={handleDelete}
          size="sm"
          variant="destructive"
          className="h-7 text-xs gap-1"
        >
          <Trash2 size={12} />
          {t('deleteConfirm')}
        </Button>
        <Button
          onClick={() => setShowDeleteConfirm(false)}
          size="sm"
          variant="outline"
          className="h-7 text-xs"
        >
          {t('deleteCancel')}
        </Button>
      </div>
    );
  }

  if (isCurrentlyEditing) {
    return (
      <div className="flex items-center gap-1">
        <Button
          onClick={handleSave}
          size="sm"
          variant="default"
          className="h-7 text-xs gap-1"
          title={t('save')}
        >
          <Save size={12} />
          {t('save')}
        </Button>
        <Button
          onClick={handleCancel}
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1"
          title={t('cancel')}
        >
          <X size={12} />
          {t('cancel')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={handleEdit}
        size="sm"
        variant="outline"
        className="h-7 text-xs gap-1"
        title={t('edit')}
      >
        <Edit size={12} />
        {t('edit')}
      </Button>
      {!isNew && (
        <Button
          onClick={() => setShowDeleteConfirm(true)}
          size="sm"
          variant="destructive"
          className="h-7 text-xs gap-1"
          title={t('delete')}
        >
          <Trash2 size={12} />
          {t('delete')}
        </Button>
      )}
    </div>
  );
}