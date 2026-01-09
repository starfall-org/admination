'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Plus, Download, RefreshCw, FileText, WrapText } from 'lucide-react';
import { Table as TableType } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';
import { useDatabaseStore } from '@/lib/store';
import InlineEditCell from './InlineEditCell';
import RowActions from './RowActions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface DataTableProps {
  table: TableType;
}

export default function DataTable({ table }: DataTableProps) {
  const { t } = useI18nStore();
  const { connection, editingRows, addNewRow, updateEditingValue, saveEditing, cancelEditing, loadTableData } = useDatabaseStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [wrapText, setWrapText] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const handleRefresh = () => {
    loadTableData(table.name);
  };

  useEffect(() => {
    // Load table data when table is selected
    if (table && connection && table.rows.length === 0) {
      loadTableData(table.name);
    }
  }, [table.name, connection, table.rows.length]);

  if (!table.columns || table.columns.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <FileText className="text-muted-foreground" size={32} />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">
              {t('noColumns')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('noTableSelected')} "{table.name}"
            </p>
          </div>
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
      <div className="bg-card border-b p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <BarChart3 size={28} />
              {table.name}
            </h2>
            <div className="flex items-center mt-2 gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">{table.columns.length} {t('columns')}</Badge>
              <Badge variant="secondary">{table.rows.length + editingRows.filter(e => e.isNew).length} {t('rows')}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                id="wrap-text"
                checked={wrapText}
                onCheckedChange={setWrapText}
              />
              <Label htmlFor="wrap-text" className="text-sm cursor-pointer flex items-center gap-1.5">
                <WrapText size={14} />
                <span>Wrap text</span>
              </Label>
            </div>
            <div className="h-6 w-px bg-border" />
            <Button
              onClick={() => addNewRow()}
              size="sm"
              className="gap-2"
            >
              <Plus size={16} />
              {t('addRow')}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download size={16} />
              {t('exportCsv')}
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
              <RefreshCw size={16} />
              {t('refresh')}
            </Button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {table.columns.map((column) => (
                <TableHead key={column.name} className="font-semibold">
                  <div className="flex flex-col gap-0.5">
                    <span>{column.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{column.type}</span>
                  </div>
                </TableHead>
              ))}
              <TableHead className="font-semibold">
                {t('actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {table.rows.length === 0 && editingRows.filter(e => e.isNew).length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={table.columns.length + 1}
                    className="h-64 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="text-muted-foreground" size={48} />
                      <p className="text-muted-foreground">{t('noData')}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {/* Existing rows */}
                  {table.rows.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      className={isEditingRow(rowIndex) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    >
                      {table.columns.map((column) => {
                        const editingRow = editingRows.find(e => e.rowIndex === rowIndex);
                        const isEditing = !!editingRow;
                        const currentValue = editingRow ? editingRow.editedData[column.name] : row[column.name];

                        return (
                          <TableCell key={column.name} className={`py-3 ${!wrapText ? 'max-w-xs truncate' : ''}`}>
                            <InlineEditCell
                              value={currentValue}
                              column={column}
                              rowIndex={rowIndex}
                              isEditing={isEditing}
                              onSave={(value) => handleCellEdit(rowIndex, column.name, value)}
                              onCancel={() => handleCancel(rowIndex)}
                              wrapText={wrapText}
                            />
                          </TableCell>
                        );
                      })}
                      <TableCell className="py-3">
                        <RowActions
                          rowIndex={rowIndex}
                          isEditing={isEditingRow(rowIndex)}
                          isNew={false}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {/* New rows (not yet saved) */}
                  {editingRows.filter(e => e.isNew).map((editingRow) => (
                    <TableRow
                      key={`new-${editingRow.rowIndex}`}
                      className="bg-green-50 dark:bg-green-900/20"
                    >
                      {table.columns.map((column) => (
                        <TableCell key={column.name} className={`py-3 ${!wrapText ? 'max-w-xs truncate' : ''}`}>
                          <InlineEditCell
                            value={editingRow.editedData[column.name]}
                            column={column}
                            rowIndex={editingRow.rowIndex}
                            isEditing={true}
                            onSave={(value) => handleCellEdit(editingRow.rowIndex, column.name, value)}
                            onCancel={() => handleCancel(editingRow.rowIndex)}
                            wrapText={wrapText}
                          />
                        </TableCell>
                      ))}
                      <TableCell className="py-3">
                        <RowActions
                          rowIndex={editingRow.rowIndex}
                          isEditing={true}
                          isNew={true}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="bg-muted/50 px-6 py-3 border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {t('showingRows')} {table.rows.length} {t('rows')}
            {editingRows.filter(e => e.isNew).length > 0 &&
              ` (+${editingRows.filter(e => e.isNew).length} ${t('rowsWithNew')})`
            }
          </span>
          <div className="flex gap-2">
            {editingRows.length > 0 && (
              <Badge variant="secondary">
                {t('rowsEditing')} {editingRows.length} {t('editRowsCount')}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}