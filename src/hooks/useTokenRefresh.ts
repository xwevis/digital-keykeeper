import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useTokenRefresh = () => {
  const { checkTokenValidity, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Check token validity every 5 minutes
    const interval = setInterval(async () => {
      await checkTokenValidity();
    }, 5 * 60 * 1000);

    // Check immediately on mount
    const checkTokens = async () => {
      await checkTokenValidity();
    };
    checkTokens();

    return () => clearInterval(interval);
  }, [isAuthenticated, checkTokenValidity]);
};