'use client';

import { useDatabaseStore } from '@/lib/store';
import LoginForm from '@/components/LoginForm';
import DatabaseViewer from '@/components/DatabaseViewer';

export default function Home() {
  const { connection } = useDatabaseStore();

  return (
    <main className="min-h-screen">
      {!connection?.connected ? <LoginForm /> : <DatabaseViewer />}
    </main>
  );
}
