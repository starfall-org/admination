'use client';

import { useState } from 'react';
import { useDatabaseStore } from '@/lib/store';
import { useI18nStore } from '@/lib/i18n';
import { Database, Loader2 } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSelector from '@/components/LanguageSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DATABASE_TYPES = [
  { value: 'postgresql', label: 'postgresql', icon: Database },
  { value: 'mysql', label: 'mysql', icon: Database },
  { value: 'turso', label: 'turso', icon: Database }
] as const;

export default function LoginForm() {
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'postgresql' | 'mysql' | 'turso'>('postgresql');
  const { connect, isConnecting, connectionError } = useDatabaseStore();
  const { t } = useI18nStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    await connect(url, type);
  };

  const handleSampleUrl = (dbType: 'postgresql' | 'mysql' | 'turso') => {
    const sampleUrls = {
      postgresql: 'postgresql://username:password@localhost:5432/database_name',
      mysql: 'mysql://username:password@localhost:3306/database_name',
      turso: 'libsql://username:password@your-db.turso.io'
    };
    setUrl(sampleUrls[dbType]);
    setType(dbType);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative">
      {/* Theme and language toggle */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Database className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">
              {t('admination')}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {t('loginSubtitle')}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">
                {t('databaseType')}
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {DATABASE_TYPES.map((dbType) => {
                  const IconComponent = dbType.icon;
                  return (
                    <Button
                      key={dbType.value}
                      type="button"
                      variant={type === dbType.value ? "default" : "outline"}
                      onClick={() => setType(dbType.value)}
                      className="h-auto py-3 flex-col gap-2"
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-xs font-medium">{t(dbType.label)}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="database-url" className="text-sm font-semibold">
                {t('databaseUrl')}
              </Label>
              <Input
                id="database-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t('databaseUrlPlaceholder')}
                className="h-11"
                required
              />
            </div>

            {connectionError && (
              <Alert variant="destructive">
                <AlertDescription>{connectionError}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isConnecting || !url.trim()}
              className="w-full h-11 text-base font-semibold"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('connecting')}
                </>
              ) : (
                t('connectDatabase')
              )}
            </Button>
          </form>

          <div className="pt-4 border-t space-y-3">
            <p className="text-xs text-muted-foreground text-center">
              {t('tryWithSampleUrl')}
            </p>
            <div className="space-y-1.5">
              {DATABASE_TYPES.map((dbType) => {
                const IconComponent = dbType.icon;
                return (
                  <Button
                    key={dbType.value}
                    type="button"
                    variant="ghost"
                    onClick={() => handleSampleUrl(dbType.value)}
                    className="w-full justify-start h-9 px-3"
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    <span className="text-xs">{t(dbType.label)}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            {t('supportedDatabases')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}