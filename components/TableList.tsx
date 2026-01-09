'use client';

import { useState } from 'react';
import { FileText, Table as TableIcon, Plus, Settings, Trash2 } from 'lucide-react';
import { useDatabaseStore } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';
import TableManager from './TableManager';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

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
        <h3 className="text-lg font-semibold mb-4">
          {t('tables')}
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {t('tables')}
          </h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCreateTable}
              size="sm"
              className="h-7 text-xs gap-1"
              title={t('createTable')}
            >
              <Plus size={12} />
              {t('createTable')}
            </Button>
            <Badge variant="secondary" className="text-xs">
              {tables.length}
            </Badge>
          </div>
        </div>

        {tables.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="text-muted-foreground" size={24} />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t('noTables')}
            </p>
            <Button
              onClick={handleCreateTable}
              size="sm"
              className="gap-2"
            >
              <Plus size={16} />
              {t('createTable')}
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {tables.map((table) => (
              <div
                key={table.name}
                className={`group relative rounded-lg transition-all ${
                  selectedTable === table.name
                    ? 'bg-accent border-l-2 border-primary'
                    : 'hover:bg-accent/50'
                }`}
              >
                <button
                  onClick={() => setSelectedTable(table.name)}
                  className="w-full text-left p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TableIcon className="text-muted-foreground" size={18} />
                      <div>
                        <h4 className="font-medium">
                          {table.name}
                        </h4>
                        <div className="text-xs text-muted-foreground flex gap-2">
                          <Badge variant="outline" className="h-4 text-xs px-1">
                            {table.columns.length} {t('columns')}
                          </Badge>
                          <Badge variant="outline" className="h-4 text-xs px-1">
                            {table.rows.length} {t('rows')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {selectedTable === table.name && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </button>
                
                {/* Table actions */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTable(table.name);
                    }}
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    title={t('editTable')}
                  >
                    <Settings size={12} />
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTable(table.name);
                    }}
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive"
                    title={t('deleteTable')}
                  >
                    <Trash2 size={12} />
                  </Button>
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
    </ScrollArea>
  );
}