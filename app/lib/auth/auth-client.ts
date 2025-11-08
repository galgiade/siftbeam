// クライアントサイド認証ユーティリティ
'use client';

import { useState, useEffect } from 'react';
import { getCurrentUserAction, signOutAction, type AuthUser } from './auth-actions';
import { debugLog, errorLog, warnLog } from '@/app/lib/utils/logger';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUserAction();
        setUser(userData);
      } catch (error) {
        errorLog('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signOut = async () => {
    try {
      await signOutAction();
      setUser(null);
    } catch (error) {
      errorLog('Sign out error:', error);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signOut,
  };
}
