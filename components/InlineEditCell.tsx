'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Column } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface InlineEditCellProps {
  value: any;
  column: Column;
  rowIndex: number;
  isEditing: boolean;
  onSave: (value: any) => void;
  onCancel: () => void;
  wrapText?: boolean;
}

export default function InlineEditCell({
  value,
  column,
  rowIndex,
  isEditing,
  onSave,
  onCancel,
  wrapText = false
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
        <Input
          type={getInputType()}
          value={editValue || ''}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="h-8 text-sm"
          autoFocus
        />
        <div className="absolute -bottom-8 left-0 flex gap-1 z-10">
          <Button
            onClick={handleSave}
            size="sm"
            variant="default"
            className="h-6 px-2"
            title={t('save')}
          >
            <Check size={12} />
          </Button>
          <Button
            onClick={onCancel}
            size="sm"
            variant="destructive"
            className="h-6 px-2"
            title={t('cancel')}
          >
            <X size={12} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`cursor-pointer hover:bg-accent p-1.5 rounded transition-colors ${!wrapText ? 'truncate' : 'whitespace-normal break-words'}`}
      title={!wrapText ? String(value) : t('clickToEdit')}
    >
      {value === null || value === undefined || value === '' ? (
        <span className="text-muted-foreground italic text-sm">{t('nullValue')}</span>
      ) : (
        <span className={`text-sm ${!wrapText ? 'block truncate' : ''}`}>
          {String(value)}
        </span>
      )}
    </div>
  );
}