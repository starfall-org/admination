'use client';

import { useEffect, useState } from 'react';
import { Database, BarChart3, Terminal } from 'lucide-react';
import { useDatabaseStore } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';
import TableList from '@/components/TableList';
import DataTable from '@/components/DataTable';
import ConnectionInfo from '@/components/ConnectionInfo';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';
import SQLShell from '@/components/SQLShell';
import { Button } from '@/components/ui/button';

export default function DatabaseViewer() {
  const { connection, tables, selectedTable, loadTables, disconnect } = useDatabaseStore();
  const { t } = useI18nStore();
  const [isSQLShellOpen, setIsSQLShellOpen] = useState(false);

  useEffect(() => {
    if (connection?.connected && tables.length === 0) {
      loadTables();
    }
  }, [connection, tables.length, loadTables]);

  if (!connection) {
    return null;
  }

  const selectedTableData = tables.find(table => table.name === selectedTable);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Database className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-semibold">
                {t('admination')}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsSQLShellOpen(true)}
                variant="outline"
                size="sm"
                className="gap-2"
                title={t('openSqlShell')}
              >
                <Terminal className="w-4 h-4" />
                <span>SQL</span>
              </Button>
              <ThemeToggle />
              <LanguageSelector />
              <ConnectionInfo />
            </div>
          </div>
          
          {/* SQL Shell Drawer */}
          <SQLShell isOpen={isSQLShellOpen} setIsOpen={setIsSQLShellOpen} />
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Table List */}
        <div className="w-80 bg-card border-r overflow-hidden">
          <TableList />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {selectedTableData ? (
            <DataTable table={selectedTableData} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="text-muted-foreground" size={48} />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t('selectTableToViewData')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('chooseTableFromList')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}