'use client';

import { useDatabaseStore } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';
import { Database, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ConnectionInfo() {
  const { connection, disconnect } = useDatabaseStore();
  const { t } = useI18nStore();

  if (!connection) return null;

  const getDatabaseName = (type: 'postgresql' | 'mysql' | 'turso') => {
    return t(type);
  };

  const maskUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const maskedUrl = urlObj.hostname + urlObj.pathname;
      return maskedUrl;
    } catch {
      return url.length > 30 ? url.substring(0, 30) + '...' : url;
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <Database className="w-4 h-4 text-muted-foreground" />
        <div className="text-sm">
          <div className="font-medium">
            {getDatabaseName(connection.type)}
          </div>
          <div className="text-xs text-muted-foreground">
            {maskUrl(connection.url)}
          </div>
        </div>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Status Badge */}
      <Badge variant={connection.connected ? "default" : "destructive"} className="gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${
          connection.connected ? 'bg-green-400' : 'bg-red-400'
        }`}></div>
        {connection.connected ? t('connected') : 'Disconnected'}
      </Badge>

      {/* Disconnect Button */}
      <Button
        onClick={disconnect}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">{t('disconnect')}</span>
      </Button>
    </div>
  );
}