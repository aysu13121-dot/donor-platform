'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

// JWT localStorage-də saxlanıldığı üçün auth vəziyyəti yalnız client-də
// bilinir (bax: AuthContext). Ona görə qorunma server middleware-i ilə deyil,
// burada, render zamanı yoxlanılır.
export default function ProtectedRoute({ children }) {
  const { ready, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace('/login');
    }
  }, [ready, isAuthenticated, router]);

  if (!ready || !isAuthenticated) {
    return null;
  }

  return children;
}
