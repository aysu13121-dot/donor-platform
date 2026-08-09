'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

// `ProtectedRoute`-un əksi: /signin və /signup kimi yalnız qonaqlar üçün
// mənalı olan səhifələr - artıq daxil olmuş istifadəçi bura əl ilə
// (köhnə bookmark, geri düymə və s.) gəlsə formu görməməli, panelə
// yönləndirilməlidir.
export default function GuestRoute({ children }) {
  const { ready, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [ready, isAuthenticated, router]);

  if (!ready || isAuthenticated) {
    return null;
  }

  return children;
}
